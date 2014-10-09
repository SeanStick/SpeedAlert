
/* JavaScript content from js/settings.js in folder common */
function checkStorage(){
	// Check if distance has been set
	if (! localStorage.howFar){
		localStorage.howFar = ".2";
	}
}

function getSettings(){
	console.log("Go");
	console.log(localStorage.howFar);
	$("#howFar").val(localStorage.howFar);
}

function saveSettings(){
	localStorage.howFar = $("#howFar").val();
}
