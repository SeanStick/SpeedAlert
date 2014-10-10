function wlCommonInit(){}
// Global variables
var watchID, speed, currentLat, currentLong, calculatedLat, calculatedLong = null;

function watchLocation(){
	
	 speed = new JustGage({
	    id: "speed",
	    value: 0,
	    min: 0,
	    max: localStorage.maxSpeed,
	    title: "Current Speed"
	  });
	 if (watchID != null) {
	    navigator.geolocation.clearWatch(watchID);
	    watchID = null;
	    $("#speed").html("")
	    $("#startStopGPS").html("Start")
	 }
	 else {
		 watchID = navigator.geolocation.watchPosition(
		 function(success){		
			 currentLat = success.coords.latitude;
			 currentLong = success.coords.longitude;
			 //$("#liveLatitude").html(success.coords.latitude);
			 //$("#liveLongitude").html(success.coords.longitude);	
			 speed.refresh(Math.round(success.coords.speed * 2.23694));
			
		 }, function(error){
			 alert("Error code:" + error.code + "\n" + "Error message: " + error.message + "\n");
		 },
		 {enableHighAccuracy: true}); 
		 $("#startStopGPS").html("Stop")
	 }	 
}

function tryIt(){
	someCrazyLatLongConversion(currentLat,currentLong);
}

function someCrazyLatLongConversion(curLat, curLong){
	var lat1 = curLat;
    var lon1 = curLong;
    //var d = .2;   //Distance in km
    var d = localStorage.howFar;
    console.log("Distance" + d)
    var R = 6371;
    var brng = 0;
    var LatMax;
    brng = toRad(brng); 
    var lat1 = toRad(lat1), lon1 = toRad(lon1);
    var lat2 = Math.asin( Math.sin(lat1)*Math.cos(d/R) + Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng) );
    var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1), Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));
        lon2 = (lon2+3*Math.PI) % (2*Math.PI) - Math.PI;  
    lat2= toDeg(lat2);
    lon2= toDeg(lon2);    
    calculatedLat = lat2;
    calculatedLong = lon2;
    console.log("Current Lat: " + currentLat + "New Lat: " + lat2 + "Current Long" + currentLong + "New Long" + lon2 );
    getSpeedData();
}

function toRad(Value) {
    /** Converts numeric degrees to radians */
    return Value * Math.PI / 180;
}
 function toDeg(Value) {
   return Value * 180 / Math.PI;
}
 
function getSpeedData(){
	$("#speedLimit").html("")	
	path = 'http://www.overpass-api.de/api/xapi?*[maxspeed=*][bbox=' + currentLong + ',' + currentLat + ',' + calculatedLong + ',' + calculatedLat +']';
	console.log(path);
	$.ajax({
        type: "GET",
        url: path,
        cache: false,
        dataType: "xml",
        success: function(xml) {
        	$(xml).find("osm").find("tag[k='maxspeed']").each(function() {        		
             //alert ($(this).attr ('v'));
        		$("#speedLimit").append($(this).attr ('v')+ " ")
            });        	
        }
    });
}