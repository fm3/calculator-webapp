window.onresize = resize;

function resize() {
	var scaleFactor = calculateScaleFactor();
	document.body.style.fontSize = 20 * scaleFactor + "pt";
}

function calculateScaleFactor() {
	var baseHeight = 650.0;
	var baseRatio = 1.5;
	
	var viewportWidth = window.innerWidth;
	var viewportHeight = window.innerHeight;
	
	if (viewportHeight / viewportWidth < baseRatio)
		return viewportHeight / baseHeight;
	else
		return viewportWidth * baseRatio / baseHeight;
}
