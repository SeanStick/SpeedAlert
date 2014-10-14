// Global variables
var watchID, speed, currentLat, currentLong, calculatedLat, calculatedLong, theTimer, hasFinished, chart, options, data, visualization = null;
var hasBeenStopped = false;
function wlCommonInit(){
	setStyles();
	$("#toolsButton,#menuBackdrop").click(function(event){
		event.stopPropagation();
		$("#toolsMenu,#menuBackdrop").toggle();
	});
	$('html').click(function() {
		$("#toolsMenu,#menuBackdrop").hide();
	});
	$(window).on("resize", function(event){
		setStyles();
	});
	//	load the main content
	loadMain();
	$("#settings").click(function(){
		loadSettings();
	});
	$("#disclaimer").click(function(){
		loadDisclaimer();
	});	
	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume", onResume, false);
	//Google Charts
	
	options = {
	          width: 100, height: 120,
	          minorTicks: 5
	        };
	data = google.visualization.arrayToDataTable([
	                                              ['Label', 'Value'],
	                                              ['Speed', 0]
	                                            ]);
	chart = new google.visualization.Gauge(document.getElementById('speedBox'));
	 visualization = new google.visualization.Gauge(container);
	 console.log("Auto start : " + localStorage.autoStartNav);
}

function watchLocation(){
	chart = new google.visualization.Gauge(document.getElementById('speedBox'));
	chart.draw(data, options);
	hasFinished = true;	 
	 if (watchID != null) {
	    navigator.geolocation.clearWatch(watchID);
	    watchID = null;
	    $("#speed,#speedLimit").html("");
	    $("#startStopGPS").html("Start").css("background-color","green");
	    clearInterval(theTimer);
	    $("#compass,#speedBox").hide();
	 }
	 else {
		 watchID = navigator.geolocation.watchPosition(
		 function(success){		
			 currentLat = success.coords.latitude;
			 currentLong = success.coords.longitude;
			 $("#compassNeedle").rotate({animateTo:success.coords.heading});
			 
			 data.setValue(0, 1, Math.round(success.coords.speed * 2.23694));			    
			 chart.draw(data, options);
		 }, function(error){
			 alert("Error code:" + error.code + "\n" + "Error message: " + error.message + "\n");
		 },
		 {enableHighAccuracy: true}); 
		 $("#startStopGPS").html("Stop").css("background-color","red");
		 $("#compass,#speedBox").show();
		 
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
    return Value * Math.PI / 180;
}
 function toDeg(Value) {
   return Value * 180 / Math.PI;
}
 
function getSpeedData(){
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
        			//remove everything that isn't a number
        			var curSpeed = $(this).attr('v').match(/\d+/)[0]
        			$("#speedLimit").html("Speed Limit<br />"+ curSpeed + " mph ");
        			options.yellowFrom = parseInt(curSpeed);
        		    options.yellowTo = parseInt(curSpeed) + 5;
        		    options.redFrom = parseInt(curSpeed) + 6;
        		    options.redTo = localStorage.maxSpeed;        		    
        			chart = new google.visualization.Gauge(document.getElementById('speedBox'));
        			chart.draw(data, options);
        			if (localStorage.playSound > 0){
        				curSpeedSound = parseInt(curSpeed) + parseInt(localStorage.playSound);
        				if ( curSpeedSound >= curSpeed){
        					console.log("Play Sound");
        					//playAudio("sounds/icq.mp3");
        				}
        			}
        		//}        		        		
            });        	
        }
    });
}

function onPause() {
	// if it is running we need to stop so we don't drain the battery
	if (watchID != null) {
		watchLocation();
		hasBeenStopped = true;
	}
}

function onResume() {
	if(hasBeenStopped){
		watchLocation();
		hasBeenStopped = false;
	}
}

function getOrientation(){
	return $(window).height() > $(window).width() ? "portrait" : "landscape";
}

function setStyles(){
	contentHeight = $(window).height() - $("#header").height();
	fixedMarginSpacing = Math.round(contentHeight * .04);
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

// Load Pages
function loadMain(){
	$("#content").load("main.html", function() {
		// Auto Run
		console.log("Auto Start? " + localStorage.autoStartNav);
		//if (localStorage.autoStartNav == 1){
		//	watchLocation();
		//}		
	});	
}

function loadSettings(){
	$("#content").load("settings.html", function() {
		checkStorage()
	    getSettings();s		
	});	
}
function loadDisclaimer(){
	$("#content").load("disclaimer.html", function() {
		// nothing for now
	});	
}
