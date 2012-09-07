function init() {
	
	//window.objNXSettings = new NXSettings($('#settings'));

	$('[data-role=page]').live('pageshow', function (event, ui) {
		$("#" + event.target.id).find("[data-role=footer]").load("./dot_tmpl/footer.htm", function(){
			$("#" + event.target.id).find("[data-role=navbar]").navbar();
		});
	});

	document.addEventListener('deviceready',onDeviceReady,false);
	function onDeviceReady() {};
			
	document.addEventListener('resume', onResume, false);
	function onResume() {
		//window.objNXStream.RefreshSearch();
	};
			
	document.addEventListener('offline', onOffline, false);
	function onOffline(){
		alert('No internet connection');
	};

	
};
