
/* JavaScript content from js/main.js in folder common */
function wlCommonInit(){
	/*
	 * Use of WL.Client.connect() API before any connectivity to a Worklight Server is required. 
	 * This API should be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 * Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */
	
	// Common initialization code goes here
	
}

// Global Vars
var watchID = null;

function getLocation(){
	alert("Start Locating!");
	WL.Device.Geo.acquirePosition(
		function (success){
			$("#curLatitude").html(success.coords.latitude);
			$("#curLongitude").html(success.coords.longitude);			
		},
		function (fail){
			alert("GPS Information is unavailable!");
		}		
	);	
}

function watchLocation(){
	alert("Go");
	 watchID = navigator.geolocation.watchPosition(onSuccess, onError);
}

function onSuccess(position) {
    var element = document.getElementById('geolocation');
    $("#liveLatitude").html(position.coords.latitude);
	$("#liveLongitude").html(position.coords.longitude);
}

// clear the watch that was started earlier
// 
function clearWatch() {
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}

// onError Callback receives a PositionError object
//
function onError(error) {
  alert('code: '    + error.code    + '\n' +
        'message: ' + error.message + '\n');
}
/* JavaScript content from js/main.js in folder android */
// This method is invoked after loading the main HTML and successful initialization of the Worklight runtime.
function wlEnvInit(){
    wlCommonInit();
    // Environment initialization code goes here
}