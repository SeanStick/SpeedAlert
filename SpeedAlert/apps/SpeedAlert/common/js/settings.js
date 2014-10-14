function checkStorage(){
	// Check if distance has been set
	if (! localStorage.howFar){
		localStorage.howFar = ".2";
	}
	if (! localStorage.maxSpeed){
		localStorage.maxSpeed = "100";
	}
	if (! localStorage.howOften){
		localStorage.howOften = "60";
	}
	if (! localStorage.autoStartNavNav){
		localStorage.autoStartNavNav = "0";
	}	
	if (! localStorage.playSound){
		localStorage.playSound = "0";
	}
}

function getSettings(){
	//slider docs http://loopj.com/jquery-simple-slider/
	$("#howFarSlide").simpleSlider();
	$("#howFarSlide").simpleSlider("setValue", localStorage.howFar);	
	$("#maxSpeed").val(localStorage.maxSpeed);
	$("#howOften").val(localStorage.howOften);
	if (localStorage.autoStartNav == 1){
		$("#autoStart").prop("checked", true);
	}
	$("#playSound").val(localStorage.playSound);	
	
}

function saveSettings(){
	localStorage.howFar = $("#howFarSlide").val();
	localStorage.maxSpeed = $("#maxSpeed").val();
	localStorage.howOften = $("#howOften").val();
	if ($("#autoStart").is(":checked")){
		localStorage.autoStartNav = 1;
		console.log("Auto start 1: " + localStorage.autoStartNav)
	}
	else{
		localStorage.autoStartNav = 0;
		console.log("Auto start 0: " + localStorage.autoStartNav)
	}
	localStorage.playSound = $("#playSound").val();
	loadMain();
}
