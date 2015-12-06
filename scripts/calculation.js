"use strict";

function tryToCalculate() {
	if (query == "") {
		displayNoResult();
		return;
	}
	var evallableQuery = machineReadableQuery();
	try {
		var result = eval(evallableQuery);		
		if(isNaN(result))
			throw "NaN";
	} catch (exception) {
		displayResultInvalidity();
		return;
	}
	displayResult(result);
}

var τ = 2 * Math.PI;
var e = Math.E;

function pow(n, toTheX) {
	if(toTheX == 0)
		return 1;
	if(!toTheX)
		return NaN;
	return (toTheX ? Math.pow(n, toTheX) : Math.pow(n, 2));
}

function log(n, base) {
	if(base == 0)
		return 0;
	return Math.log(n) / (base ? Math.log(base) : 1);
}

function nthRoot(n, base) {
	if(n < 0 || base == 0)
		return NaN;
	return (base ? Math.pow(n, 1/base) : Math.sqrt(n));
}

function sin(aNumber) {
	aNumber %= τ;
	
	if(almostEqual(aNumber, τ) || almostEqual(aNumber, τ/2)  || almostEqual(aNumber, 0))
		return 0;
	if(almostEqual(aNumber, τ/4))
		return 1;
	if(almostEqual(aNumber, 3*τ/4))
		return -1;
		
	if(almostEqual(aNumber, τ/12) || almostEqual(aNumber, 5*τ/12))
		return 0.5;
	if(almostEqual(aNumber, 7*τ/12) || almostEqual(aNumber, 11*τ/12))
		return -0.5;
	
	return Math.sin(aNumber);
}


function cos(aNumber) {
	aNumber %= τ;
	
	if(almostEqual(aNumber, τ) || almostEqual(aNumber, 0))
		return 1;
	if(almostEqual(aNumber, τ/2))
		return -1;
	if(almostEqual(aNumber, τ/4) || almostEqual(aNumber, 3*τ/4))
		return 0;
		
	if(almostEqual(aNumber, τ/6) || almostEqual(aNumber, 5*τ/6))
		return 0.5;
	if(almostEqual(aNumber, τ/3) || almostEqual(aNumber, 2*τ/3))
		return -0.5;
	
	return Math.cos(aNumber);
}

function tan(aNumber) {	
	return sin(aNumber) / cos(aNumber);
}

function almostEqual(aNumber, anotherNumber, epsilon) {
	if (!epsilon)
		epsilon = 0.00000000000001;
	return (Math.abs(aNumber - anotherNumber) < epsilon)
}
