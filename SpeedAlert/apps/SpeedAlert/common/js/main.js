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

// Global variables
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
	 watchID = navigator.geolocation.watchPosition(
	 function(success){
		 $("#liveLatitude").html(success.position.coords.latitude);
		$("#liveLongitude").html(success.position.coords.longitude);
	 }, function(error){
		 alert("Error code:" + error.code + "\n" + "Error message: " + error.message + "\n");
	 });
}

function stopGPS() {
    if (watchID != null) {
        navigator.geolocation.clearWatch(watchID);
        watchID = null;
    }
}
