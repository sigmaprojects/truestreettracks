
document.addEventListener('deviceready',onDeviceReady,false);
function onDeviceReady() {
	//alert('ready');
};
			
document.addEventListener('resume', onResume, false);
function onResume() {
	//window.objNXStream.RefreshSearch();
};
			
document.addEventListener('offline', onOffline, false);
function onOffline(){
	//alert('No internet connection');
};


function init() {
	
	//window.objNXSettings = new NXSettings($('#settings'));
	window.objControllerClass = new ControllerClass();
	
	window.objRecordTrack = new RecordTrack( $('#record-track') );

	$('[data-role=page]').live('pageshow', function (event, ui) {
		$("#" + event.target.id).find("[data-role=footer]").load("./dot_tmpl/footer.htm", function(){
			$("#" + event.target.id).find("[data-role=navbar]").navbar();
		});
	});
	
};


function calculateDistance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180;
	var radlat2 = Math.PI * lat2/180;
	var radlon1 = Math.PI * lon1/180;
	var radlon2 = Math.PI * lon2/180;
	var theta = lon1-lon2;
	var radtheta = Math.PI * theta/180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180/Math.PI;
	dist = dist * 60 * 1.1515;
	//if (unit=="K") { dist = dist * 1.609344 };
	//if (unit=="N") { dist = dist * 0.8684 };
	var ret = {
		k : ( dist * 1.609344 ),
		m : dist,
		n : ( dist * 0.8684 )
	};
	return ret;
};