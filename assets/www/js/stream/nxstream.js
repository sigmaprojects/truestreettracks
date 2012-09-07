function NXStream(Context){
	this.Context = Context;
	this.Init();
};

NXStream.prototype.objPostProperties = function( objPostProperties ){
	this.PostProperties = objPostProperties;
};

NXStream.prototype = new NXControllerClass;
NXStream.prototype.Init = function(){
	var objSelf = this;

	objSelf.NXImages  = new NXImages(objSelf.Context);

	objSelf.Context.on('vclick', 'button#refreshstream',
		function( objEvent ) {
			var $this = $(this);
			objSelf.RefreshSearch();
			objEvent.preventDefault();
			return( false );
		}
	);

	objSelf.Context.on('vclick', 'button#newpost',
		function( objEvent ) {
			var $this = $(this);
			objSelf.ShowNewPostDiag( $this );
			objEvent.preventDefault();
			return( false );
		}
	);

	objSelf.Context.on('submit', 'form#streameditform',
		function( objEvent ) {
			var $this = $(this);
			objSelf.SendNewStreamPost( $this );
			objEvent.preventDefault();
			return( false );
		}
	);
	objSelf.Context.on('reset', 'form#streameditform',
		function( objEvent ) {
			var $this = $(this);
			objSelf.NXImages  = new NXImages(objSelf.Context);
			$('ul.nximages',objSelf.Context).empty();
			$('fieldset#imageoptionscontainer',objSelf.Context).empty();
			/*
			var target = $('div#streamlistcontainer', objSelf.Context);
			var list = $('ul#streamlist', target);
			target.trigger('create');
			list.listview('refresh');
			*/
			var streameditpopup = $('div#streamedit',objSelf.Context);
			streameditpopup.popup('close');
			
			return( true );
		}
	);


	objSelf.Context.on('vclick', '.newcommentbtn',
		function( objEvent ) {
			var $this = $(this);
			objSelf.ShowNewCommentDiag( $this );
			objEvent.preventDefault();
			return( false );
		}
	);
	objSelf.Context.on('submit', 'form#streamcommenteditform',
		function( objEvent ) {
			var $this = $(this);
			objSelf.SendNewCommentPost( $this );
			objEvent.preventDefault();
			return( false );
		}
	);
	



	objSelf.CacheView();
	
	objSelf.Context.on('pageshow',
		function(e,data) {
			if( $('div#streamlistcontainer', objSelf.Context).length > 0) {
				// Get a reference to the list container.
				var container = $('div#streamlistcontainer', objSelf.Context);
		
				objSelf.stopUpdating = false;
		
				var footer = $('footer');
					footer.css('position','fixed');
					footer.css('bottom','-15px');
					footer.css('width','100%');
					footer.css('margin','auto');
					footer.css('background-color','#fff');
					footer.css('border-width', '0 25 0 25');
		
				var list = $('ul',container);
		
		
				$(window).on('scroll resize', function(objEvent){
					objSelf.stopUpdating = false;
					objSelf.checkListItemContents(container, list);
				});
		
				objSelf.checkListItemContents(container, list);
			};
		}
	);


	objSelf.Context.on('pagehide',function(e, data){
		$(window).off('scroll resize');
		$(window).off('scroll');
		$(window).off('resize');
		$(window).die('scroll resize');
		$(window).die('resize');
		$(window).die('scroll');
		objSelf.stopUpdating = true;
	});


	return;
};


NXStream.prototype.ShowNewPostDiag = function( jElm ) {
	var objSelf = this;
	var editStreamPostDiag = $('div#streamedit');
	if( objSelf.getSelfUser() && objSelf.getSelfUser().hasfacebookauth === true ) {
		$('fieldset#tofacebookoptioncontainer',editStreamPostDiag).show();
	};
	objSelf.Context.trigger('create');
	editStreamPostDiag.popup('open');
	return;
};

NXStream.prototype.SendNewStreamPost = function( jElm ) {
	var objSelf = this;
	
	$('button[type="submit"]',jElm).attr('disabled','disabled');
	$.mobile.showPageLoadingMsg();
	
	var objPostProperties = {
		StreamBody: $('textarea[name="streambody"]').val(),
		toFacebook: ( $('input#toFacebook:checked').val() ? true : false ),
        images: objSelf.NXImages.getImageIDs(true)
	};
	$.ajax({
		type: 'POST',
		url: objSelf.getEnviroment().BaseControllerURL + 'stream/postStream',
		data: objPostProperties,
		dataType: 'json',
		success: function(response, status, request) {
			objSelf.SendNewStreamPostHandler( response, jElm );
		},
		error: function () { $.mobile.hidePageLoadingMsg(); },
        complete: function() {  }
	});
 
	return;
};
NXStream.prototype.SendNewStreamPostHandler = function(response, jElm) {
	var objSelf = this;

		var Streams = [];
		Streams.push( response );
		var SteamResult = {
			entries: Streams,
			count: 1
		};

		var target = $('div#streamlistcontainer', objSelf.Context);
		var list = $('ul#streamlist', target);

		var doTemplate = doT.template(objSelf.StreamListTemplate);
		var tmplHtml = doTemplate( SteamResult );

		list.prepend(tmplHtml);
		target.trigger('create');
		list.listview('refresh');
		

		$('span.streambody a, div.comment a',list).each(function(index) {
			var $this = $(this);
			var attr = $this.attr('target');
			if (typeof attr === 'undefined' ) {
				$this.attr('target', '_nxexternal');
				$this.attr('href', objSelf.getEnviroment().Domain + $this.attr('href'));
			}
		});
	jElm[0].reset();
	jElm.trigger('reset');
	$('button[type="submit"]',jElm).removeAttr('disabled');
	$('div#streamedit').popup('close');
	$.mobile.hidePageLoadingMsg();
	return;
};



NXStream.prototype.ShowNewCommentDiag = function( jElm ) {
	var objSelf = this;
	var editStreamCommentPostDiag = $('div#streamcommentedit');
	$('input[name="stream_id"]').val( jElm.data('stream_id') );
	editStreamCommentPostDiag.popup('open');
	return;
};

NXStream.prototype.SendNewCommentPost = function( jElm ) {
	var objSelf = this;
	
	$('button[type="submit"]',jElm).attr('disabled','disabled');
	$.mobile.showPageLoadingMsg();
	
	var objPostProperties = {
		CommentBody: $('textarea[name="commentbody"]').val(),
		stream_id: $('input[name="stream_id"]').val(),
	};
	$.ajax({
		type: 'POST',
		url: objSelf.getEnviroment().BaseControllerURL + 'stream/postStreamComment',
		data: objPostProperties,
		dataType: 'json',
		success: function(response, status, request) {
			objSelf.SendNewCommentPostHandler( response, jElm );
		},
		error: function () { $.mobile.hidePageLoadingMsg(); },
        complete: function() {  }
	});
 
	return;
};
NXStream.prototype.SendNewCommentPostHandler = function(response, jElm) {
	var objSelf = this;

		var CommentResult = {
			comment: response
		};

		var streamListContainer = $('div#streamlistcontainer', objSelf.Context);
		var streamList = $('ul#streamlist', target);

		var target = $('div.comments[data-stream_id="'+response.stream_id+'"]', objSelf.Context);
		var doTemplate = doT.template(objSelf.StreamCommentTemplate);
		var tmplHtml = doTemplate( CommentResult );
		target.append(tmplHtml);

		
		streamListContainer.trigger('create');
		streamList.listview('refresh');

		$('a',target).each(function(index) {
			var $this = $(this);
			var attr = $this.attr('target');
			if (typeof attr === 'undefined' ) {
				$this.attr('target', '_nxexternal');
				$this.attr('href', objSelf.getEnviroment().Domain + $this.attr('href'));
			}
		});
	jElm[0].reset();
	$('button[type="submit"]',jElm).removeAttr('disabled');
	$('div#streamcommentedit').popup('close');
	$.mobile.hidePageLoadingMsg();
	return;
};





NXStream.prototype.getMoreListItems = function( list, onComplete ) {
	var objSelf = this;
	$.mobile.showPageLoadingMsg();
	
	var nextOffset = (list.data( "nextOffset" ) || 0);
	if (list.data( "xhr" )){
		return;
	};

	var objPostProperties = [];
		objPostProperties.push({
			'name':  'offset',
			'value': nextOffset
		});
		objPostProperties.push({
			'name':  'max',
			'value': 10
		});
	
	$.mobile.showPageLoadingMsg();
	list.data(
		"xhr",
		$.ajax({
			type: 'get',
			url: objSelf.getEnviroment().BaseControllerURL + 'stream/list',
			data: objPostProperties,
			dataType: 'json',
			success: function( response ){
				
				objSelf.LastStreamListResponse = response;
				objSelf.UpdateView();
				
				list.data('nextOffset',(nextOffset + 9 + 1));
			},
			complete: function(){
				$.mobile.hidePageLoadingMsg();
				list.removeData( "xhr" );
				onComplete();
			},
			error: function() {
				$.mobile.hidePageLoadingMsg();
			}
		})
	);	
};

NXStream.prototype.isMoreListItemsNeeded = function( container, list ) {
	var objSelf = this;
	if(objSelf.stopUpdating) {
		return(false);
	};
	var viewTop = $( window ).scrollTop();
	var viewBottom = (viewTop + $( window ).height());
	var containerBottom = Math.floor(
		container.offset().top +
		container.height()
	);
	var scrollBuffer = 150;
	if ((containerBottom - scrollBuffer) <= viewBottom){
		return( true );
	} else {
		return( false );
	};
};

NXStream.prototype.checkListItemContents = function( container, list ) {
	var objSelf = this;
	if (objSelf.isMoreListItemsNeeded( container, list )){
		objSelf.getMoreListItems(
			list,
			function(){
				objSelf.checkListItemContents( container, list );
			}
		);
	};
};








NXStream.prototype.CacheView = function() {
	var objSelf = this;
	$.ajax({
		async: false,
		type: 'GET',
		url: './dot_tmpl/stream/list.htm',
		success: function(template, status, request) {
			objSelf.StreamListTemplate = template;
		},
		error: function () {},
        complete: function() {}
	});

	$.ajax({
		async: false,
		type: 'GET',
		url: './dot_tmpl/stream/comment.htm',
		success: function(template, status, request) {
			objSelf.StreamCommentTemplate = template;
		},
		error: function () {},
        complete: function() {}
	});
	

	return;
};


NXStream.prototype.UpdateView = function() {
	var objSelf = this;
	
	var target = $('div#streamlistcontainer', objSelf.Context);
	var list = $('ul#streamlist', target);
	var resultcount = $('div#resultcount', target);
	
	if(objSelf.LastStreamListResponse.results.entries.length) {
		var def = {
			commenttmpl: objSelf.StreamCommentTemplate
		};
		var doTemplate = doT.template(objSelf.StreamListTemplate, undefined, def);
		var tmplHtml = doTemplate( objSelf.LastStreamListResponse.results );
		
		list.append(tmplHtml);
		target.trigger('create');
		list.listview('refresh');

		$('span.streambody a, div.comment a',list).each(function(index) {
			var $this = $(this);
			var attr = $this.attr('target');
			if (typeof attr === 'undefined' ) {
				$this.attr('target', '_nxexternal');
				$this.attr('href', objSelf.getEnviroment().Domain + $this.attr('href'));
			}
		});
		
		
	} else {
		objSelf.stopUpdating = true;
	};
	
	resultcount.text('Showing ' + $('li',list).length + ' of ' + objSelf.LastStreamListResponse.results.count);

	return;
};


NXStream.prototype.RefreshSearch = function() {
	var objSelf = this;
	objSelf.stopUpdating = false;
	var list = $('ul#streamlist',objSelf.Context);
	list.data('nextOffset',0);
	list.html('');
	$('div#resultcount', objSelf.Context).text('');
	$(window).trigger('resize');
	return;
};
