// Global variables
var watchID, speed, currentLat, currentLong, calculatedLat, calculatedLong, theTimer, hasFinished, speedometerWidth, speedometerHeight, chart, options, data, visualization = null;
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
		watchLocation();
		watchLocation();
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
	          width: speedometerWidth, height: speedometerHeight,
	          minorTicks: 5
	        };
	data = google.visualization.arrayToDataTable([
	                                              ['Label', 'Value'],
	                                              ['Speed', 0]
	                                            ]);
	chart = new google.visualization.Gauge(document.getElementById('speed'));
	visualization = new google.visualization.Gauge(container);
	//console.log("Auto start : " + localStorage.autoStartNav);
	 $("#theme").attr("href", "css/" + localStorage.selectTheme); 
}

function watchLocation(){	
	if (localStorage.compassType != 1){
		$("#compass").css('background-image', 'none').css('text-align','center');
		$("#compassNeedle").hide();
	}
	else{
		$("#compass").css('text-align','inherit');
	}
	chart = new google.visualization.Gauge(document.getElementById('speed'));
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
			 if (localStorage.compassType == 1){
				 $("#compassNeedle").rotate({animateTo:success.coords.heading});
			 }
			 else if(localStorage.compassType == 2){
				 x = getHeadingText(success.coords.heading);					
				 $("#compass").html("<strong>Heading</strong><br />" + x);
				 if(getOrientation() == "landscape"){
     				$("#compass").css("height",$("#speeds").height()+"px");
     			}
			 }
			 else{
				 $("#compass").html();
			 }
			 
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
		//console.log("has finished: " + hasFinished);
		someCrazyLatLongConversion(currentLat,currentLong);		
	}	
}

function someCrazyLatLongConversion(curLat, curLong){
	var lat1 = curLat;
    var lon1 = curLong;
    var d = localStorage.howFar;
    //console.log("Distance" + d);
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
    //console.log("Current Lat: " + currentLat + "New Lat: " + lat2 + "Current Long" + currentLong + "New Long" + lon2 );
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
	//console.log(path);
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
        			if(getOrientation() == "landscape"){
        				$("#speedLimitBox").css("height",$("#speeds").height()+"px");
        			}
        			else{
        				$("#speedLimitBox").css("height","52px");
        			}
        			options.yellowFrom = parseInt(curSpeed);
        		    options.yellowTo = parseInt(curSpeed) + 5;
        		    options.redFrom = parseInt(curSpeed) + 6;
        		    options.redTo = localStorage.maxSpeed;        		    
        			chart = new google.visualization.Gauge(document.getElementById('speed'));
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

function getHeadingText (heading){
	var dir;
	if (heading >= 0 && heading <= 11.25){
		dir = "N";
	}
	
	if (heading > 348.75 && heading <= 360){
		dir = "N";
	}
	
	if (heading > 11.25 && heading <= 33.75){
		dir = "NNE";
	}
	
	if (heading > 33.75 && heading <= 56.25){
		dir = "NE";
	}
	
	if (heading > 56.25 && heading <= 78.75){
		dir = "ENE";
	}
	
	if (heading > 78.75 && heading <= 101.25){
		dir = "E";
	}
	
	if (heading > 101.25 && heading <= 123.75){
		dir = "ESE";
	}
	
	if (heading > 123.75 && heading <= 146.25){
		dir = "SE";
	}
	
	if (heading > 146.25 && heading <= 168.75){
		dir = "SSE";
	}
	
	if (heading > 168.75 && heading <= 191.25){
		dir = "S";
	}
	
	if (heading > 191.25 && heading <= 213.75){
		dir = "SSW";
	}
	
	if (heading > 213.75 && heading <= 236.25){
		dir = "SW";
	}
	
	if (heading > 236.25 && heading <= 258.75){
		dir = "WSW";
	}
	
	if (heading > 258.75 && heading <= 281.25){
		dir = "W";
	}
	
	if (heading > 281.25 && heading <= 303.75){
		dir = "WNW";
	}
	
	if (heading > 303.75 && heading <= 326.25){
		dir = "NW";
	}
	
	if (heading > 326.25 && heading <= 348.75){
		dir = "NNW";
	}
	return dir;
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
	contentWidth = $(window).width();
	fixedMarginSpacing = Math.round(contentHeight * .04);
	//console.log(getOrientation());
	//console.log($(window).height());
	//console.log(contentHeight + " " + contentWidth);
	if(getOrientation() == "portrait"){
		otherHeights = $("#startStopGPS").height() + $("#speeds").height() + $("#compass").height();
		speedometerWidth = speedometerHeight = Math.round(contentWidth * .96);
		compassHeight = contentHeight - $("#startStopGPS").height() - speedometerHeight - (fixedMarginSpacing*4);
		$("#speeds").css("margin","2%");
		$("#compass").css('height',compassHeight+"px");
		$("#speedLimitBox").css("height","52px");
	}
	else{
		otherHeights = $("#startStopGPS").height() + $("#compass").height();
		workingHeight = contentHeight - $("#startStopGPS").height();
		workingHeight = workingHeight - (fixedMarginSpacing*2);
		speedometerWidth = speedometerHeight = Math.round(workingHeight * .96);
		$("#speeds").css("margin","0");
		$("#compass").css("height",speedometerHeight+"px");
		$("#speedLimitBox").css("height","52px");
		$("#speedLimitBox").css("height",$("#speeds").height()+"px");
		//console.log("workingHeight: " + workingHeight);
		//console.log("speedometerWidth: " + speedometerWidth);
		//console.log("speedometerHeight: " + speedometerHeight);
	}
	options = {
	          width: speedometerWidth, height: speedometerHeight,
	          minorTicks: 5
	        };
}

// Load Pages
function loadMain(){
	$("#content").load("main.html", function() {
		// Auto Run
		//console.log("Auto Start? " + localStorage.autoStartNav);
		if (localStorage.autoStartNav == 1){
			watchLocation();
		}		
	});	
}

function loadSettings(){
	$("#content").load("settings.html", function() {
		checkStorage()
	    getSettings();
	});	
}
function loadDisclaimer(){
	$("#content").load("disclaimer.html", function() {
		// nothing for now
	});	
}
