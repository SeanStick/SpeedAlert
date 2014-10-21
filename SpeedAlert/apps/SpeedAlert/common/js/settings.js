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
	if (! localStorage.autoStartNav){
		localStorage.autoStartNav = "0";
	}
	if (! localStorage.compassType){
		localStorage.compassType = "0";
	}
	if (! localStorage.playSound){
		localStorage.playSound = "0";
	}
	if (! localStorage.selectTheme){
		localStorage.selectTheme = "theme1.css";
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
	$("#compassType").val(localStorage.compassType);
	$("#playSound").val(localStorage.playSound);
	var shortTheme = localStorage.selectTheme;
	shortTheme = shortTheme.substring(0, shortTheme.length - 4);
	alert(shortTheme);
	$("#" + shortTheme).prop("checked", true);
	
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
	localStorage.compassType = $("#compassType option:selected").val();
	localStorage.playSound = $("#playSound").val();
	localStorage.selectTheme = $('input[name=myTheme]:checked').val();
	 $("#theme").attr("href", "css/" + localStorage.selectTheme);
	loadMain();
}
