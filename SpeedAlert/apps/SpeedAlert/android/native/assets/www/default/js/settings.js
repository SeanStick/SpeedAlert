
/* JavaScript content from js/settings.js in folder common */
function checkStorage(){
	// Check if distance has been set
	if (! localStorage.howFar){
		localStorage.howFar = ".2";
	}
	if (! localStorage.maxSpeed){
		localStorage.maxSpeed = "100";
	}
}

function getSettings(){
	console.log("Go");
	console.log(localStorage.howFar);
	//slider docs http://loopj.com/jquery-simple-slider/
	$("#howFarSlider").val(localStorage.howFar);
	howFarSlide.simpleSlider("setValue", localStorage.howFar);
	$("#maxSpeed").val(localStorage.maxSpeed);
}

function saveSettings(){
	localStorage.howFar = $("#howFarSlide").val();
	localStorage.maxSpeed = $("#maxSpeed").val();
}
