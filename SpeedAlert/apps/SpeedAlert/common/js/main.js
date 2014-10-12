function wlCommonInit(){
	setStyles();
	$("#toolsButton,#menuBackdrop").click(function(){
		$("#toolsMenu,#menuBackdrop").toggle();
	});
	$(window).on("resize", function(event){
		setStyles();
	});
}
// Global variables
var watchID, speed, currentLat, currentLong, calculatedLat, calculatedLong, theTimer, hasFinished = null;

function watchLocation(){
	hasFinished = true;
	 speed = new JustGage({
	    id: "speed",
	    value: 0,
	    min: 0,
	    max: localStorage.maxSpeed,
	    title: "Current Speed",
	    relativeGaugeSize: "true"
	  });
	 
	 if (watchID != null) {
	    navigator.geolocation.clearWatch(watchID);
	    watchID = null;
	    $("#speed,#speedLimit").html("");
	    $("#startStopGPS").html("Start").css("background-color","green");
	    clearInterval(theTimer);
	 }
	 else {
		 watchID = navigator.geolocation.watchPosition(
		 function(success){		
			 currentLat = success.coords.latitude;
			 currentLong = success.coords.longitude;
			 $("#compassNeedle").rotate({animateTo:success.coords.heading});
			 speed.refresh(Math.round(success.coords.speed * 2.23694));
		 }, function(error){
			 alert("Error code:" + error.code + "\n" + "Error message: " + error.message + "\n");
		 },
		 {enableHighAccuracy: true}); 
		 $("#startStopGPS").html("Stop").css("background-color","red");
		// tryIt();
		 theTimer = setInterval(function() {
			tryIt();
		 }, localStorage.howOften * 1000);
	 }	 
}

function tryIt(){
	
	if(hasFinished){
		hasFinished = false;
		console.log("has finished: " + hasFinished);
		someCrazyLatLongConversion(currentLat,currentLong);
		
	}	
}

function someCrazyLatLongConversion(curLat, curLong){
	var lat1 = curLat;
    var lon1 = curLong;
    //var d = .2;   //Distance in km
    var d = localStorage.howFar;
    console.log("Distance" + d);
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
	//$("#speedLimit").html("");	
	path = 'http://www.overpass-api.de/api/xapi?*[maxspeed=*][bbox=' + currentLong + ',' + currentLat + ',' + calculatedLong + ',' + calculatedLat +']';
	console.log(path);
	row = 0;
	$.ajax({
        type: "GET",
        url: path,
        cache: false,
        dataType: "xml",
        success: function(xml) {
        	hasFinished = true;
        	$(xml).find("osm").find("tag[k='maxspeed']").each(function() {        		
             //alert ($(this).attr ('v'));
        		//if (row == 0){
        			$("#speedLimit").html("Speed Limit<br />"+$(this).attr ('v')+ " ");
        		//}        		        		
            });        	
        }
    });
}

function getOrientation(){
	return $(window).height() > $(window).width() ? "portrait" : "landscape";
}

function setStyles(){
	contentHeight = $(window).height() - $("#header").height();
	fixedMarginSpacing = Math.round(contentHeight * .04);
	console.log(fixedMarginSpacing);
	if(getOrientation() == "portrait"){
		otherHeights = $("#startStopGPS").height() + $("#speeds").height() + $("#compass").height();
		whitespaceHeight = contentHeight - otherHeights - fixedMarginSpacing;
		newMargin = Math.round(whitespaceHeight / 3);
		$("#speeds").css("margin",newMargin+"px 0px");
		$("#compass").css("margin","0 auto");
	}
	else{
		otherHeights = $("#startStopGPS").height() + $("#compass").height();
		whitespaceHeight = contentHeight - otherHeights;
		newMargin = Math.round(whitespaceHeight / 2) - fixedMarginSpacing;
		$("#speeds,#compass").css("margin",newMargin+"px 0px");
	}
}