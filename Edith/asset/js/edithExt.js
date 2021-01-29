/*

 ___    _ _ _   _    
| __|__| (_) |_| |_  
| _|/ _` | |  _| ' \ 
|___\__,_|_|\__|_||_|

Ver: 0.1
License: WTFPL
Author: INSYCO_NESH

File: edithExt.js
Regroupe tout, sauf les fonctions edithCore.js

*/



/* --------- */
/* Commandes */
/* --------- */

// error
Edith.addError = function(explain, erno='---') {
	Edith.consoleOutput('<span class="consoleError">Erreur (' + erno + ') ' + explain + '</span>');
	throw new Error('(' + erno + ') ' + explain);
}

Edith.fatalPan = function(title, explain, callback) {

	$("#fatalPan-title")[0].html = title;
	$("#fatalPan-expl")[0].html = explain;

	if (typeof callback) {} else {}
}

Edith.consoleOutput = function(output, withNL) {
	if (Edith.domConsole) {

		if (typeof output !== 'string') {
			return false;
		}

		output = output.replace(/\n/g, "<br>")

		if (withNL) {
			Edith.domConsole.innerHTML += (output + '<br>');
		} else {
			Edith.domConsole.innerHTML += (output);
		}

	}
}

Edith.consoleClear = function() {
	Edith.domConsole.innerHTML = "";
}



// Statutbar
Edith.setStatut = function(statut, fade) {
	if (Edith.domStatut) {
		if (typeof statut !== 'string') {
			Edith.addError('setStatut, statut n\'est pas un string');
		}

		$(Edith.domStatut).text(statut)

		if (fade) {
			setTimeout(function() {
				$(Edith.domStatut).empty()
			}, 3000);
		}
	}
}

Edith.getCaractInfo = function() {

	var editorArray = Edith.domEditor.value.slice(0, Edith.domEditor.selectionEnd).split("\n"),
		lineNoTot = Edith.domEditor.value.split("\n").length,
		lineNoCur = editorArray.length,
		columnNo = editorArray.pop().length + 1;

	return {"lineNoTot": lineNoTot, "lineNoCur": lineNoCur, "columnNo": columnNo}
}

Edith.setCaractInfo = function() {
	if (Edith.domCaractInfo) {
		let infos = Edith.getCaractInfo();
		$(Edith.domCaractInfo).text('Line ' + infos.lineNoCur + '/' + infos.lineNoTot + ', Column ' + infos.columnNo);
	}
}

// Windows
Edith.openWin = function(winName, arg = false) {

	// functions a lancer selon la fenêtre qui s'ouvre

	function menuOpened(arg = false) {
		let inputElem = $("#menuWinInput")[0]
		inputElem.focus();

		if (arg) {
			if (arg["resetPath"] == true) {
				Edith.menuPath = []
				inputElem.value = "";
			}
		}

		Edith.handleMenu("getfeed", {"searchStr": inputElem.value})
	}

	function settingsOpened() {

		let inputElem = $("#settingsEditor")[0];
		inputElem.focus();
		inputElem.moveCursor(0)
		inputElem.value = Edith.settings.text

	}

	if (winName !== Edith.activeWin) { // si la fenêtre est déjà ouverte ou non
		if (typeof winName == "string") {
			if (typeof Edith.domWindows[winName] == "object" && typeof Edith.domWindows[winName]["elem"] == "object") {
				Edith.closeWin();
				Edith.domWindows[winName]["elem"].classList.add("openedWin");
				Edith.activeWin = winName;

				if (typeof Edith.domWindows[winName]["func"] == "string") {

					if (arg && typeof arg == "object") {
						eval(Edith.domWindows[winName]["func"])(arg)
					} else {
						eval(Edith.domWindows[winName]["func"] + "();")
					}

				}

			} else {
				Edith.addError("openWin, " + winName + " n'existe pas")
			}
		} else {
			Edith.addError("openWin, winName n'est pas un string")
		}
	} else {
		Edith.closeWin();
	}
}

Edith.closeWin = function() {
	let tempOpenedWin = $(".openedWin")
	for (var i = 0; i < tempOpenedWin.length; i++) { // on ferme toutes les fenêtres
		tempOpenedWin[i].classList.remove("openedWin");
		Edith.activeWin = "";
	}
}

Edith.handleContextMenu = function(e) {
	console.log($(e.target).parents())
	e.preventDefault()
}

Edith.handleKeyPress = function(e) {

	var keysPressed = []

	if (e.ctrlKey) { keysPressed.push("ctrl"); } 	// créait un str a partir des touches entréés
	if (e.altKey) { keysPressed.push("alt"); }	 	// ex : ctrl+alt+a ou shift+b etc..
	if (e.shiftKey) { keysPressed.push("shift"); }
	if (["Alt", "Control", "Shift"].indexOf(e.key) == -1) {
		keysPressed.push(e.key.toLowerCase());
	}

	var keysPressed = keysPressed.join("+");

	var keyBind = Edith.settings.obj["keyBind"];
	var canExecute = true;
	for (var iKeys = 0; iKeys < keyBind.length; iKeys++) {
		canExecute = true;
		if (typeof keyBind[iKeys]["keys"] == "string" && keyBind[iKeys]["keys"] == keysPressed) {

			if (typeof keyBind[iKeys]["context"] == "object") {

				let context = keyBind[iKeys]["context"]
				for (var iCont = 0; iCont < context.length; iCont++) {
					if (typeof context[iCont]["type"] == "string") {

						if (context[iCont]["type"] == "focus") {
							let focused = Edith.getFocused()

							if (typeof context[iCont]["focused"] == "string") {
								if (context[iCont]["focused"] != focused) {
									canExecute = false
								}
							} else if (typeof context[iCont]["focused"] == "object" && typeof context[iCont]["focused"].indexOf == "function") {
								if (context[iCont]["focused"].indexOf(focused) == -1) {
									canExecute = false
								}
							}
						}
					}
				}
			}

			if (canExecute) {
				var bind = keyBind[iKeys];

				if (bind["prevDefault"]) {
					e.preventDefault();
				}

				if (bind["command"]) {
					Edith.execCmd(bind["command"]);
				}

				break;
			}
		}
	}
}

Edith.handleOnChangeInput = function(cmd) {

	Edith.execCmd(cmd);

}

Edith.getFocused = function() {

	if (document.activeElement["id"] == "editor") {
		return "editor"
	} else if (Edith.activeWin != "") {
		return Edith.activeWin
	} else {
		return "body";
	}

}

Edith.createEditor = function(elem) {

	if (window.Behave) { // déclare l'editeur Behave
		Edith.editor = new Behave({
			textarea: 		elem,
			replaceTab: 	true,
			softTabs: 		false,
			tabSize: 		4,
			autoOpen: 		false,
			overwrite: 		false,
			autoStrip: 		false,
			autoIndent: 	false
		});
	} else {
		Edith.addError("Behave n'est pas déclaré");
		return false;
	}
}

Edith.handleMenu = function(action, arg = false) {

	function getCurDir() {
		var curDir = Edith.settings.obj["menuArray"];
		for (var iPath = 0; iPath < Edith.menuPath.length; iPath++) {
			curDir = (function(dir = curDir) {
				for (var iName = 0; iName < dir.length; iName++) {
					if (dir[iName]["name"] == Edith.menuPath[iPath] && dir[iName]["type"] == "fold") {
						return dir[iName]["content"];
					}
				}
				return false;
			}())

			if (!curDir) {
				Edith.addError("handleMenu, path n'est pas correct (" + Edith.menuPath[iPath] + " n'existe pas, ou n'est pas un folder)")
			}

		}
		return curDir;
	}

	if (action == "getfeed") {
		// go to path
		var curDir = getCurDir();

		// filter str
		var retArray = []
		var regex = new RegExp($("#menuWinInput")[0].value,'gi');
		for (var i = 0; i < curDir.length; i++) {
			if (curDir[i]["name"].search(regex) != -1) {
				retArray.push(curDir[i])
			}
		}

		var elem = $("#menuWin"), menuElem = $("#menuLinesArray")[0]
		menuElem.innerHTML = "";

		for (var i = 0; i < retArray.length; i++) {

			if (retArray[i]["type"] == "fold") {
				var typeLine = "menuLineFold"
			} else {
				var typeLine = "menuLineCmd"
			}

			var selected = ""
			if (i == Edith.menuPointer) {
				selected = "activeMenuLine"
			}

			menuElem.innerHTML += "<div class=\"menuLine " + typeLine + " " + selected + "\">" + retArray[i]["name"] + "</div>"
		}

		Edith.handleMenu("movePointer", {"direction": "reset"})

	} else if (action == "movePointer") {

		if (arg) {
			if(typeof arg["direction"] == "string" && (arg["direction"] == "up" || arg["direction"] == "down" || arg["direction"] == "reset")) {

				if (arg["direction"] == "up") {
					Edith.menuPointer--
				} else if (arg["direction"] == "down") {
					Edith.menuPointer++
				} else if (arg["direction"] == "reset") {
					Edith.menuPointer = 0;
				}

				$(".activeMenuLine").removeClass("activeMenuLine")

				if (Edith.menuPointer < 0) {
					Edith.menuPointer = $(".menuLine").length - 1
				}

				if (Edith.menuPointer > $(".menuLine").length - 1) {
					Edith.menuPointer = 0
				}
				var elem = $(".menuLine")[Edith.menuPointer]
				if (elem) {
					elem.classList.add("activeMenuLine")
					elem.scrollIntoView({behavior: "smooth", block: "nearest"})
				}


			}
		}

	} else if (action == "execute") {

		var selectedIndex = $(".activeMenuLine").index()

		if (selectedIndex != -1) {
			var selectedCmd = getCurDir()[selectedIndex]
			console.log(selectedCmd);
			if (selectedCmd["type"] == "cmd" && typeof selectedCmd["cmd"] == "object") {
				Edith.closeWin();
				Edith.execCmd(selectedCmd["cmd"])
			} else if (selectedCmd["type"] == "fold" && typeof selectedCmd["content"] == "object") {
				Edith.handleMenu("changeDir", {"direction": "forward", "name": selectedCmd["name"]})
			}

		}
	} else if (action == "changeDir") {

		if (arg) {

			var selectedCmd = getCurDir()[$(".activeMenuLine").index()]

			if (arg["direction"] == "forward" && typeof arg["name"] == "string") {
				Edith.menuPath.push(selectedCmd["name"]);
			} else if (arg["direction"] == "backward") {
				Edith.menuPath.pop();
			} else if (arg["direction"] == "reset") {
				Edith.menuPath = [];
			}

			Edith.menuPointer = 0;
			Edith.handleMenu("getfeed");
		}

	}
}

/* ----------------------------------- */
/* Execution code / gestion workers js */
/* ----------------------------------- */

Edith.worker = {};
Edith.worker.create = function(runwith) {
	try {
		if (window.Worker) {
			Edith.worker.wrk = new Worker(Edith.worker.interpreter[runwith]);
		}
		Edith.worker.wrk.onmessage = function(e) {
			Edith.consoleOutput(e.data)
		}
	} catch (error) {
		Edith.addError('worker.create, erreur :' + worker.create)
	}

}

Edith.worker.tell = function(toTell) {
	if (Edith.worker.wrk) {
		Edith.worker.wrk.postMessage(toTell);
	} else {
		Edith.addError("worker.tell, communication impossible, le worker n'existe pas")
	}
}

Edith.execCode = function() {
	Edith.setStatut("Execution du code ...", true)

	Edith.worker.create(options["runwith"])
	Edith.consoleClear();
	Edith.worker.tell({'code': Edith.domEditor.value})
}

/* ----------- */
/* Gestion API */
/* ----------- */

Edith.sendApi = function(requ, callback, addError) {

	// chaque requête envoyé est mise dans xhrArray pour permettre d'avoir plusieurs
	// requêtes en simultané

	if (typeof xhrArray) {
		xhrArray = new Array();
	}

	var xhrOffset = 0; // l'offset de l'xhr
	while(typeof(xhrArray[xhrOffset]) != "undefined") {
		xhrOffset++
	}

	xhrArray[xhrOffset] = new XMLHttpRequest()
	xhrArray[xhrOffset].open("POST", "asset/api/api.php");

	var form = new FormData();
	if (typeof requ != "string") {
		var requJson = JSON.stringify(requ)
	} else {
		requJson = requ;
	}

	form.append("requ", requJson)

	xhrArray[xhrOffset].onreadystatechange = function () { // function qui se déclenche au retour de demande
		if(this.readyState === 4) {
			if (this.status === 200) { // si tout est ok
				try { // on teste si la réponse est compatible JSON
					jsonResponse = JSON.parse(this.response);
				} catch (error) { // sinon cela veut dire que il s'est passé une erreur fatale pour l'API
					jsonResponse = false;
					Edith.addError("Erreur XHR, la réponse n'est pas du json valide");
				}

				if (jsonResponse) {
					if (addError) {
						if (typeof jsonResponse["success"] == "boolean" && !jsonResponse["success"]) {
							if(typeof jsonResponse["errorExpl"] == "string") {
								Edith.addError(jsonResponse["errorExpl"])
							} else {
								Edith.addError("Erreur XHR, une erreur est survenu, sans explication")
							}
						}
					}

					if (callback) {
						callback(this);
					} else {
						console.log(jsonResponse)
					}
				}
			} else {
				Edith.addError("Erreur XHR, erreur reseau")
			}
		}
		delete xhrArray[xhrOffset];
	};
	xhrArray[xhrOffset].send(form)
}


Edith.execCmd = function(cmd) {

	console.log(cmd);

	function execute(cmd) {
		// try {
			var opcode = cmd["opcode"],
				arg = cmd["arg"]

			switch(opcode) {

				case "openWin":
					if (typeof arg["arg"] == "object") {
						Edith.openWin(arg["win"], arg["arg"])
					} else {
						Edith.openWin(arg["win"])
					}
					break;
				case "handleMenu":
					Edith.handleMenu(arg["action"], arg)
					break;
				case "print":
					Edith.consoleOutput(arg["text"])
					break;
				case "execCode":
					Edith.execCode()
					break;
				case "closeWin":
					Edith.closeWin()
					break;
				default:
					Edith.addError("execCmd, la commande n'existe pas, pourtant elle a passé la vérification")
					break;
			}
		// } catch (error) {
		// 	Edith.addError("Erreur durant l'execution d'une commande (" + cmd["opcode"] + ")", error)
		// }
	}

	// vérification selon confCmd

	if (cmd) {
		if (cmd["opcode"]) {
			if(typeof Edith.cmdArray[cmd["opcode"]] == "object") { // typeof verifie si l'objet existe et si il est du bon type
				var forConfCmd = Edith.cmdArray[cmd["opcode"]]
				if (typeof forConfCmd["neededArg"] == "object") {
					if (typeof cmd["arg"] != "object") {
						Edith.addError("execCmd, la commande ne contient pas d'argument, pourtant il en require")
					}
					for (var i = 0; i < forConfCmd["neededArg"].length; i++) {
						if (
								typeof forConfCmd["neededArg"][i] == "object" &&
								typeof forConfCmd["neededArg"][i][0] == "string" &&
								typeof forConfCmd["neededArg"][i][1] == "string"
							) {
							if (typeof cmd["arg"][forConfCmd["neededArg"][i][0]] == forConfCmd["neededArg"][i][1]) {
								// toutes les vérification étant faites, on peut executer
								execute(cmd)
							}
						} else {
							Edith.addError("execCmd (confCmd), neededArg n'a pas le bon format")
						}
					}
				} else {
					// toutes les vérification étant faites, on peut executer
					execute(cmd)
				}
			} else {
				Edith.addError("execCmd, la commande n'est pas reconnue (" + cmd["opcode"] + ")")
			}
		} else {
			Edith.addError("execCmd, l'opcode n'est pas défini")
		}
	} else {
		Edith.addError("execCmd, cmd n'est pas défini")
	}

}

HTMLElement.prototype["moveCursor"] = function(start, end = start) {
	this.selectionStart = start
	this.selectionEnd = end
}


function sniff(obj) {

}
