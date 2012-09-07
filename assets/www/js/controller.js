function ControllerClass(){
	var objSelf = this;
	objSelf.enviroment = 'dev';

	$(document).ajaxError( function(event, jqXHR, ajaxSettings, thrownError) {
		var httpStatusCode = jqXHR.status;
		if( httpStatusCode == 200 ) {
			
		} else if(status == 401) {
			jqXHR.abort();
			alert('Auth Error.');
			//$.mobile.changePage('#login-view', {transition: 'slide'});
		} else {
			alert('Unknown error, please try again.');
		};
		
	});

};

ControllerClass.prototype.setBusy = function(isBusy) {
	var objSelf = this;
	if( isBusy ) {
		$.mobile.showPageLoadingMsg();
	} else {
		$.mobile.hidePageLoadingMsg();
	};
};

ControllerClass.prototype.getEnviroment = function() {
	var objSelf = this;
	switch(objSelf.enviroment) {
		case 'dev': {
			return {
				Domain: 'http://tracks.truestreets.com',
				BaseControllerURL: 'http://tracks.truestreets.com/api/v1/'
			}
			break;
		}
		default: {
			return {
				Domain: 'http://tracks.truestreets.com',
				BaseControllerURL: 'http://tracks.truestreets.com/api/v1/'
			}
			break;
		}
	};
};


Date.prototype.toUTCArray = function(){
    var D= this;
    return [D.getUTCFullYear(), D.getUTCMonth(), D.getUTCDate(), D.getUTCHours(),
    D.getUTCMinutes(), D.getUTCSeconds()];
};
Date.prototype.toISO = function() {
	var tem, A= this.toUTCArray(), i= 0;
	A[1]+= 1;
	while(i++<7){
		tem= A[i];
		if (tem < 10) {
			A[i] = '0' + tem;
		};
	};
    return A.splice(0, 3).join('-')+'T'+A.join(':');    
};
