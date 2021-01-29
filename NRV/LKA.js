theLKAelem = document.getElementById("theLKA")
daWindowIsHear = false;
statDaWindow = ""
codeBackup = ""

function gotoLine(line) {
	daWindow(false);
	statDaWindow = "";

	for (var i = 0, nbn = 0; nbn < line; i++) {
		if (theLKAelem.value[i] == "\n") {
			nbn++
		}
		if (i > theLKAelem.value.length) {
			theLKAelem.selectionEnd = 1;
			break;
		}
	}
	theLKAelem.focus();
	theLKAelem.selectionEnd = i-1;
	theLKAelem.selectionStart = theLKAelem.selectionEnd
	console.log(theLKAelem.selectionEnd)
}

function daWindow(openQ, changeTo, argArray) {
	daWindowElem = document.getElementById("daWindow")

	if (openQ) {
		if (daWindowIsHear) {
			daWindowElem.innerHTML = ""
		} else {
			daWindowElem.style.display = "block"
			daWindowIsHear = true;
		}

		if (changeTo == "changelog") {
			daWindowElem.innerHTML = document.getElementById("changelogRep").innerHTML
			daWindowElem.style.width = "75%";
			daWindowElem.style.height = "75%";
		} else if (changeTo == "about") {
			daWindowElem.innerHTML = document.getElementById("aboutRep").innerHTML
			daWindowElem.style.width = "75%";
			daWindowElem.style.height = "75%";
		} else if (changeTo == "error") {
			daWindowElem.innerHTML = document.getElementById("errorRep").innerHTML
			daWindowElem.style.width = "50%";
			daWindowElem.style.height = "100px";
			daWindowElem.style.overflow = "hidden"
		} else if (changeTo == "gotoLine") {
			daWindowElem.innerHTML = document.getElementById("gotoLineRep").innerHTML
			daWindowElem.style.width = "50%";
			daWindowElem.style.height = "100px";
			daWindowElem.style.overflow = "hidden"
			document.getElementById("inputGotoLine").style.position = "absolute"
			document.getElementById("inputGotoLine").focus()
		} else if (changeTo == "whereLine") {

			console.log((theLKAelem.value.substring(0, theLKAelem.selectionStart)).split("\n").length)
			daWindowElem.innerHTML = document.getElementById("whereLineRep").innerHTML

			document.querySelectorAll("#daWindow h1 #whereLineAsr")[0].innerHTML = (theLKAelem.value.substring(0, theLKAelem.selectionStart)).split("\n").length


			daWindowElem.style.width = "25%";
			daWindowElem.style.height = "100px";
			daWindowElem.style.overflow = "hidden"
		}


	} else {
		document.getElementById("daWindow").style.display = "none"
		daWindowIsHear = false;
	}
}
 
document.body.onkeydown = function(e) {

	if (e.key == "P" && e.shiftKey && e.ctrlKey && e.altKey) { 
		codeBackup = theLKAelem.value
		theLKAelem.value = document.getElementById("caspRep").innerHTML
	} else if (e.key == "Escape") {
		daWindow(false)
		statDaWindow = ""
	} else if (e.key == "c" && e.altKey) {
		if (statDaWindow == "changelog") {
			daWindow(false)
			statDaWindow = ""
		} else {
			daWindow(true, "changelog")
			statDaWindow = "changelog"
		}
		e.preventDefault();
	} else if (e.key == "a" && e.altKey) {
		if (statDaWindow == "about") {
			daWindow(false)
			statDaWindow = ""
		} else {
			daWindow(true, "about")
			statDaWindow = "about"
		}
		e.preventDefault();
	} else if (e.key == "g" && e.altKey) {
		if (statDaWindow == "gotoLine") {
			daWindow(false)
			statDaWindow = ""
		} else {
			daWindow(true, "gotoLine")
			statDaWindow = "gotoLine"
		}
		e.preventDefault();
	} 
}

theLKAelem.onkeydown = function(e) {
	if (e.key == "Tab" ) {
    	e.preventDefault();
    	theLKAelem.value += "	";
  	} else if (e.key == "F9") {
		e.preventDefault();
		console.clear();

		document.getElementById("output").innerHTML = ""

		code = theLKAelem.value.replace(/#.+/g, "")

		execute(getC(code));
	} else if (e.key == "F1") { // comment bro 
		
		var selStart = theLKAelem.selectionStart;
		var selEnd = theLKAelem.selectionEnd;
		if (selStart != selEnd) {
			var textAvant = theLKAelem.value.substring(0, selStart)
			var textApres = theLKAelem.value.substring(selEnd)
			var toComment = theLKAelem.value.substring(selStart, selEnd)

			if (toComment[0] == "#") {
				toComment = toComment.replace(/_/g, " ").replace(/#/g, "")
			} else {
				toComment = "#" + toComment.replace(/\n/g, "\n#").replace(/ /g, "_")
			}

			var toReput = textAvant + toComment + textApres
			theLKAelem.value = toReput
			theLKAelem.selectionEnd = textAvant.length + toComment.length;
		}
	} else if (e.key == "w" && e.altKey) {
		if (statDaWindow == "whereLine") {
			daWindow(false)
			statDaWindow = ""
		} else {
			daWindow(true, "whereLine")
			statDaWindow = "whereLine"
		}
		e.preventDefault();
	} 
};

function printToPage(toPrint) {
	document.getElementById("output").innerHTML += toPrint
}