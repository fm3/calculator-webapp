"use strict";

function createButtons() {	
	var buttons = [
	[
		["add('7')",     "7"],
		["add('8')",     "8"],
		["add('9')",     "9"],
		["backspace()",  "←"],
		["clearQuery()", "C"]
	],
	[
		["add('4')",     "4"],
		["add('5')",     "5"],
		["add('6')",     "6"],
		["add('•')",     "×"],
		["add('/')",     "/"]
	],
	[
		["add('1')",     "1"],
		["add('2')",     "2"],
		["add('3')",     "3"],
		["add('+')",     "+"],
		["add('−')",     "−"]
	],
	[
		["add('0')",     "0"],
		["add('.')",     "."],
		["add('(')",     "("],
		["add(')')",     ")"],
		["add(',')",     ","]
	],
	[
		["add('^')",          "^x" ],
		["add('√(', true)",   "√"  ],
		["add('log(', true)", "log"],
		["add('e', true)",    "e"  ],
		["add('τ', true)",    "τ"  ]
	],
	[
		["add('sin(', true)", "sin"],
		["add('cos(', true)", "cos"],
		["add('tan(', true)", "tan"],
		["add('°')",          "°"  ]
	]
	
	];
	
	var parentElement = $("buttons");
	for (var rowIndex in buttons) {
		for (var colIndex in buttons[rowIndex]) {
			addButton(parentElement, buttons[rowIndex][colIndex]);
		}
		if(rowIndex < buttons.length - 1)
			addLineBreak(parentElement);
	}
}

function addButton(parentElement, buttonEntry) {
	var buttonAction = buttonEntry[0];
	var buttonName = buttonEntry[1];

	var button = document.createElement("button");
	button.setAttribute("type", "button");
	if ('ontouchstart' in document.documentElement)
		button.setAttribute("ontouchstart", buttonAction);
	else
		button.setAttribute("onclick", buttonAction);
	parentElement.appendChild(button);
	
	var buttonText = document.createTextNode(buttonName);
	button.appendChild(buttonText);
}

function addLineBreak(parentElement) {
	var lineBreak = document.createElement("br");
	parentElement.appendChild(lineBreak);
}
