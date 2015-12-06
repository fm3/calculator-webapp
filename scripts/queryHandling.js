"use strict";

var query, cursorPosition;

function clearQuery() {
	cursorPosition = 0;
	query = "";
	displayQuery();
	tryToCalculate();
}

function displayQuery() {
	var queryDisplayNode = $("query");
	
	initializeQueryOutput(queryDisplayNode);
	
	for(var charIndex in query) {
		addCursorIfNecessary(queryDisplayNode, charIndex);
		addQuerySpacer(queryDisplayNode);
		addQueryCharSpan(queryDisplayNode, query[charIndex], charIndex);
	}
}

function initializeQueryOutput(queryDisplayNode) {
	while (queryDisplayNode.firstChild) {
    	queryDisplayNode.removeChild(queryDisplayNode.firstChild);
	}
	
	queryDisplayNode.onclick = placeTextCursorToEnd;

	var spacer = document.createElement("div");
	spacer.className = "querySpacer";
	queryDisplayNode.appendChild(spacer);
	
	var prompt = document.createElement("span");
	prompt.className = "queryPrompt";
	prompt.onclick = placeTextCursorToBeginning;
	
	var promptSymbol = document.createTextNode("> ");
	prompt.appendChild(promptSymbol);
	
	queryDisplayNode.appendChild(prompt);
}

function addQuerySpacer(queryDisplayNode) {
	var spacer = document.createElement("div");
	spacer.className = "querySpacer";
	queryDisplayNode.appendChild(spacer);
}

function addQueryCharSpan(queryDisplayNode, charToAdd, charIndex) {
	var queryCharSpan = document.createElement("span");
	queryCharSpan.setAttribute("id", "queryCharSpan" + charIndex);
	queryCharSpan.className = "queryCharSpan";
	queryCharSpan.className += spacingClassNameFor(charToAdd);
	queryCharSpan.setAttribute("onclick", "placeTextCursorNextTo(event, " + charIndex + ")");
	queryDisplayNode.appendChild(queryCharSpan);
	
	var queryChar = document.createTextNode(query[charIndex]);
	queryCharSpan.appendChild(queryChar);
}

function placeTextCursorNextTo(event, charIndex) {
	event.stopPropagation();
	
	var span = $("queryCharSpan" + charIndex);
	var clickXInSpan = event.pageX - span.offsetLeft;
	var spanWidth = span.offsetWidth;
	
	var correctedIndex = charIndex;
	if(clickXInSpan > spanWidth / 2)
		correctedIndex++;
	
	placeTextCursor(correctedIndex);
}

function placeTextCursorToEnd() {
	placeTextCursor(query.length);
}

function placeTextCursorToBeginning(event) {
	event.stopPropagation();
	placeTextCursor(0);
}

function placeTextCursor(index) {
	cursorPosition = index;
	displayQuery();
}

function addCursorIfNecessary(parentNode, charIndex) {
	if (charIndex != cursorPosition)
		return;
		
	var textCursor = document.createElement("div");
	textCursor.setAttribute("id", "textCursor");
	parentNode.appendChild(textCursor);
}

function spacingClassNameFor(char) {
	var spacingClassName = "";
	if ("+−".indexOf(char) !== -1)
		spacingClassName += " bigSpaceLeft";
	if ("+−,".indexOf(char) !== -1)
		spacingClassName += " bigSpaceRight";
	if ("/•".indexOf(char) !== -1)
		spacingClassName += " smallSpaceLeft smallSpaceRight";
	return spacingClassName;
}

function add(expression, shouldInsertTimes) {
	if(shouldInsertTimes)
		insertTimesIfNecessary();

	insertIntoQuery(expression);

	cursorPosition += expression.length;
	displayQuery();
	tryToCalculate();
}

function insertTimesIfNecessary() {
	if(cursorPosition == 0 )
		return;

	var lastChar = query[cursorPosition - 1];
	if(!isOperator(lastChar)) {
		insertIntoQuery("•");
		cursorPosition++;
	}
}

function insertIntoQuery(expression) {
	query = query.substring(0, cursorPosition) 
		    + expression
		    + query.substring(cursorPosition);
}

function isOperator(char) {
	var operators = "(•−/+,^";
	if (operators.indexOf(char) === -1)
		return false;
	return true;
}


function backspace() {
	var queryUntoCursor = query.substring(0, cursorPosition);
	if(   postfixIs(queryUntoCursor, "sin(") 
       || postfixIs(queryUntoCursor, "cos(")
       || postfixIs(queryUntoCursor, "tan(")
       || postfixIs(queryUntoCursor, "pow(")
       || postfixIs(queryUntoCursor, "log(")) {
		query = query.substring(0, cursorPosition - 4) + query.substring(cursorPosition);
		cursorPosition -= 4;
	} else {
		query = query.substring(0, cursorPosition - 1) + query.substring(cursorPosition);
		cursorPosition--;
	}
	if(cursorPosition < 0)
		cursorPosition = 0;

	displayQuery();
	tryToCalculate();
}

function postfixIs(haystack, needle) {
	var postfix = haystack.substring(haystack.length - needle.length);
	return (postfix == needle);
}

function machineReadableQuery() {
	var machineQuery = String(query);
	machineQuery = addClosingParentheses(machineQuery);
	machineQuery = resolveInfixExponentiation(machineQuery);
	machineQuery = replaceAll(machineQuery, "√", "nthRoot");
	machineQuery = replaceAll(machineQuery, "−", "-");
	machineQuery = replaceAll(machineQuery, "•", "*");
	machineQuery = replaceAll(machineQuery, "°", "*τ/360");
	console.log("transformed: " + machineQuery);
	return machineQuery;
}

function replaceAll(string, find, replace) {
	return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function resolveInfixExponentiation(expression) {
	var originalExpression;
	do {
		originalExpression = expression;
		expression = resolveOneInfixExponentiation(expression);
	} while (originalExpression != expression);
	return expression;
}

function resolveOneInfixExponentiation(expression) {
	for (var charIndex in expression) {
		charIndex = parseInt(charIndex);
		if (expression[charIndex] == '^') {
			var baseStringStart = findBaseStringStartUnto(expression, charIndex);
			var exponentStringEnd = findExponentStringEndFrom(expression, charIndex);
			return rearrangeExponentiation(expression, baseStringStart, charIndex, exponentStringEnd);
		}
	}
	return expression;
}

function findBaseStringStartUnto(expression, charIndex) {
	var isParenthesesExpression = false;
	var parenthesesDepth = 0;
	charIndex--;
	while (charIndex >= 0) {
		//read one parentheses expression
		if (expression[charIndex] == ')') {
			parenthesesDepth++;
			isParenthesesExpression = true;
		}
		if (expression[charIndex] == '(')
			parenthesesDepth--;
		if(parenthesesDepth <= 0)
			break;
		charIndex--;
	}
	if(isParenthesesExpression) {
		//read one function name
		charIndex--;
		while (charIndex >= 0) {
			if (matchesFunctionName(expression[charIndex])) {
				charIndex--;
			} else {
				return charIndex + 1;
			}
		}
	}
	else {
		//read one number
		while (charIndex >= 0) {
			if (isNumericChar(expression[charIndex]))
				charIndex--;
			else
				return charIndex + 1;
		}
	}

	return charIndex + 1;
}

function isNumericChar(char) {
	return ("0123456789eτ.".indexOf(char) !== -1);
}

function matchesFunctionName(char) {
	var functionNames = "sincostanpowlog√";
	return (functionNames.indexOf(char) !== -1);
}

function findExponentStringEndFrom(expression, charIndex) {
	var parenthesesDepth = 0;
	var isParenthesesExpression = false;
	charIndex++;
	while (charIndex <= expression.length) {
		//read one parentheses expression
		if (expression[charIndex] == '(') {
			parenthesesDepth++;
			isParenthesesExpression = true;
		}
		if (expression[charIndex] == ')')
			parenthesesDepth--;
		if(parenthesesDepth <= 0)
			break;
		charIndex++;
	}
	if (isParenthesesExpression)
		return charIndex - 1;
		
	var isNumber = false;
	var isFunctionName = false;
	
	if(isNumericChar(expression[charIndex])) {
		charIndex++;
		isNumber = true;
	}
	if(matchesFunctionName(expression[charIndex])) {
		charIndex++;
		isFunctionName = true;
	}
	if(isNumber) {
		while (charIndex <= expression.length) {
			if (isNumericChar(expression[charIndex]))
				charIndex++;
			else
				return charIndex - 1;
		}
	}
	
	
	if(isFunctionName) {
		//read one function name
		while (charIndex <= expression.length) {
			if (matchesFunctionName(expression[charIndex])) {
				charIndex++;
			} else {
				break;
			}
		}
		//read one parentheses expression
		while (charIndex <= expression.length) {
			if (expression[charIndex] == '(')
				parenthesesDepth++;
			if (expression[charIndex] == ')')
				parenthesesDepth--;
			if(parenthesesDepth <= 0)
				break;
			charIndex++;
		}
	}
	
	return charIndex - 1;
}

function rearrangeExponentiation(expression, baseStringStart, charIndex, exponentStringEnd) {
	var prefix = expression.substring(0, baseStringStart);
	var base = expression.substring(baseStringStart, charIndex);
	var exponent = expression.substring(charIndex + 1, exponentStringEnd + 1);
	var postfix = expression.substring(exponentStringEnd + 1);
	
	var separator = ",";	
	if(exponent == "")
		separator = "";
	
	return (prefix + "pow(" + base + separator + exponent + ")" + postfix); 
}

function addClosingParentheses(expression) {
	var parenthesesDepth = 0;
	for (var i = 0; i < expression.length; i++) {
		if(expression[i] == '(')
			parenthesesDepth++;
		if(expression[i] == ')')
			parenthesesDepth--;
	};
	while(parenthesesDepth > 0) {
		expression += ')';
		parenthesesDepth--;
	}
	return expression;
}
