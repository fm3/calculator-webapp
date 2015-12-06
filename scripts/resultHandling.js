"use strict";

function displayResult(result) {
	$('result').textContent = formatResult(result);
	$('result').className = "valid";
}

function displayNoResult() {
	$('result').textContent = "";
	$('result').className = "valid";
}

function displayResultInvalidity() {
	$('result').className = "invalid";
}

function formatResult(resultNumber) {	
	var expression = String(parseFloat(resultNumber.toPrecision(12)));
	expression = replaceAll(expression, "-","−");

	return "= " + expression;
}




function $(id) {
	return document.getElementById(id);
}
