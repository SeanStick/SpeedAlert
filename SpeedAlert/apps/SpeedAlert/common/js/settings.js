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
}

function getSettings(){
	console.log("Go");
	console.log("How Far: " + localStorage.howFar);
	//slider docs http://loopj.com/jquery-simple-slider/
	$("#howFarSlide").simpleSlider("setValue", localStorage.howFar);	
	$("#maxSpeed").val(localStorage.maxSpeed);
	$("#howOften").val(localStorage.howOften);
	
}

function saveSettings(){
	localStorage.howFar = $("#howFarSlide").val();
	localStorage.maxSpeed = $("#maxSpeed").val();
	localStorage.howOften = $("#howOften").val();
}
