function RecordTrack(Context){
	this.Context = Context;
	$.extend(this, window.objControllerClass);
	this.Init();
};

RecordTrack.prototype.Init = function(){
	var objSelf = this;

	objSelf.Recording = false;

	objSelf.Context.on('vclick', '#start-track-recording',
		function( objEvent ) {
			var $this = $(this);
			objSelf.StartRecording( $this );
			objEvent.preventDefault();
			return( false );
		}
	);

	objSelf.Context.on('vclick', '#stop-track-recording',
		function( objEvent ) {
			var $this = $(this);
			objSelf.StopRecording( $this );
			objEvent.preventDefault();
			return( false );
		}
	);

	objSelf.Context.on('pageshow', function(e, data){
		$(document).bind('pagebeforechange', function(e, data) {
			objSelf.PageBeforeHide( e, data );
		});
	});


	objSelf.Context.on('pagehide',function(e, data){
		$(document).unbind('pagebeforechange');
	});
	/*
	objSelf.Context.on('pagebeforehide',function(e, data){
		return objSelf.PageBeforeHide(e, data);
	});
	*/
	//$(document).bind('mobileinit', function() {
	//});

	

	return;
};



RecordTrack.prototype.PageBeforeHide = function(e, data) {
	var objSelf = this;
	var to = data.toPage;
	var from = data.options.fromPage;
	if (typeof to  === 'string') {
		var u = $.mobile.path.parseUrl(to);
		to = u.hash || '#' + u.pathname.substring(1);
		if( from ) {
			from = '#' + from.attr('id');
		};
		if( from === '#record-track' ) {
			if( objSelf.Recording ) {
				var confirmResult = confirm('Currently recording track, are you sure you want to stop?');
				if( confirmResult === true ) {
					objSelf.StopRecording();
					return true;
				} else {
					e.stopImmediatePropagation();
					e.preventDefault();
					objSelf.Context.find('.ui-btn-active').removeClass('ui-btn-active');
					return false;
				}
				return false;
			} else {
				return true;
			};
		};
	};
};



RecordTrack.prototype.StopRecording = function() {
	var objSelf = this;
	objSelf.Recording = false;
	var startBtn = $('#start-track-recording');
	startBtn.text('Start');
	startBtn.buttonMarkup({theme: 'a'}).button('refresh');
	return;
};

RecordTrack.prototype.StartRecording = function( jElm ) {
	var objSelf = this;
	objSelf.Recording = true;
	jElm.text('Recording...');
	jElm.buttonMarkup({theme: 'c'}).button('refresh');
	return;
};










RecordTrack.prototype.Test = function( jElm ) {
	var objSelf = this;
	var objPostProperties = {};
	/*
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
	*/
	console.log( objSelf.getEnviroment().BaseControllerURL );
	return;
};