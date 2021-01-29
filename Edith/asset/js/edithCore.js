/*

 ___    _ _ _   _    
| __|__| (_) |_| |_  
| _|/ _` | |  _| ' \ 
|___\__,_|_|\__|_||_|

Ver: 0.1
License: WTFPL
Author: INSYCO_NESH

File: edithCore.js
Regroupe les quelques fonctions essentielles au fonctionnement (principalement l'init)

*/ 

Edith = {} 

Edith.init = {
	"done": false,
	"milestone": 0,

	"todo": [], // toutes les étapes a faire
	"milestoneDecr": [], // toutes les descriptions
	"milestoneFunc": [], // et les fonctions
	"milestoneLastFunc": [], // permet d’exécuter une fonction en dernier

	"stepsTot": 0, // rempli ensuite
	"stepsDone": 0,
}

Edith.init.error = function(errorCode = false) {

	var elem = document.getElementById("loaderPan-info");

	if (!errorCode) {
		errorCode = "Erreur Init: une erreur inconnue s'est déclenché"
	} else {
		errorCode = "Erreur Init: code " + errorCode
	}

	elem.classList.add("loaderPan-infoError");
	elem.innerHTML = errorCode;

	throw new Error(errorCode);
}

Edith.loadScript = function(url, callback) {
	var script = document.createElement('script');
	script.setAttribute('src', url);
	script.setAttribute('type', 'text/javascript');

	script.onload = function () {
		callback();
	};

	document.getElementsByTagName("head")[0].appendChild(script);
};

Edith.init.finish = function() {
	document.getElementById("loaderPan").style.display = "none";
	Edith.init.done = true;
	Edith.setStatut("Init terminé", true)
}

Edith.init.passStep = function(stepName) {
	
	if (typeof stepName != "undefined") {
		var milestone = Edith.init["milestone"]
		var milestoneList = Edith.init["todo"][milestone];

		if(milestoneList.indexOf(stepName) != -1) { // si l'étape existe

			Edith.init["todo"][milestone].splice(milestoneList.indexOf(stepName), 1) // supprime l'étape
			Edith.init["stepsDone"]++

			// update loaderPan-steps

			document.getElementById("loaderPan-steps").innerHTML = "<span>" + stepName + "</span>" + document.getElementById("loaderPan-steps").innerHTML

			// update progress bar

			var elem = document.getElementById("loaderPan-innerBar");
			elem.style.width = Math.round((Edith.init["stepsDone"]/Edith.init["stepsTot"])*100) + "%"

			if (Edith.init["todo"][milestone].length == 0) {
				
				Edith.init["milestone"]++;

				if (Edith.init["milestone"] > Edith.init["milestoneDecr"].length -1) {
					Edith.init.finish()
				} else {
					Edith.init.executeMilestone(Edith.init["milestone"]);
				}
			} else if (Edith.init["todo"][milestone].length == 1) {

				if (typeof Edith.init["milestoneLastFunc"][milestone] == "function") {
					Edith.init["milestoneLastFunc"][milestone]()
				}

			}
		} else {
			Edith.init.error("0x001")
		}
	}
}

Edith.init.executeMilestone = function(milestoneNb = false) {

	if (typeof milestoneNb == "number") {
		func = Edith.init["milestoneFunc"][milestoneNb]

		if (typeof func == "function") {
			document.getElementById("loaderPan-info").innerHTML = Edith.init["milestoneDecr"][milestoneNb];

			func()
		} else {
			Edith.init.error("0x002")
		}
	}

}

Edith.init.newMilestone = function(descr = false, steps = false, func = false, lastFunc = false) {

	if (typeof steps == "object") {
		Edith.init["todo"].push(steps)

		Edith.init["stepsTot"] += steps.length
	} else {
		Edith.init.error("0x003")
	}

	if (typeof descr == "string") {
		Edith.init["milestoneDecr"].push(descr)
	} else {
		Edith.init.error("0x004")
	}
	
	if (typeof func == "function") {
		Edith.init["milestoneFunc"].push(func)
	} else {
		Edith.init.error("0x005")
	}

	if (typeof lastFunc == "function") {
		Edith.init["milestoneLastFunc"].push(lastFunc)
	} else {
		Edith.init["milestoneLastFunc"].push(false)
	}
}

Edith.init.launch = function() {
	Edith.init.executeMilestone(0);
}

Edith.init.newMilestone("Loading de toutes les librairies", [
	"lib-behave",
	"lib-jquery",
	"lib-json5",
	"lib-edithExt",
	"lib-giveSomeTime"
], function() {

	function loadLib(path, stepName) {
		Edith.loadScript(path, function() {

			Edith.init.passStep(stepName)
		})
	}

	loadLib("asset/js/lib/jquery.js", "lib-jquery")
	loadLib("asset/js/lib/behave.js", "lib-behave")
	loadLib("asset/js/lib/json5.js", "lib-json5")

	loadLib("asset/js/edithExt.js", "lib-edithExt")



}, function() { 
	setTimeout(function() {Edith.init.passStep("lib-giveSomeTime")}, 200) // laisse un peu de temps au librairies de s'initialiser
});


Edith.init.newMilestone("Initialisation des paramètres", ["param-get"], function() {
	
	$.ajax({
		url: "settings.txt",
		dataType: "text"
	}).done(function(data) {

		Edith.settings = {}
		Edith.settings.text = data
		Edith.init.passStep("param-get")
	});


})

Edith.init.newMilestone("Initialisation des paramètres", ["param-parse"], function() {
	Edith.settings.obj = JSON5.parse(Edith.settings.text) 

	Edith.init.passStep("param-parse")
})

Edith.init.newMilestone("Initialisation des variables", ["var-windows", "var-worker", "var-commands", "var-misc"], function() {
		
	Edith.activeWin = ''
	Edith.domWindows = {
		"about": {"elem": $("#aboutWin")[0]},
		"changelog": {"elem": $("#changelogWin")[0]},
		"menu": {"elem": $("#menuWin")[0], "func": "menuOpened"},
		"settings": {"elem": $("#settingsWin")[0], "func": "settingsOpened"}
	}

	Edith.menuPath = []
	Edith.menuPointer = 0

	Edith.init.passStep("var-windows")


	Edith.worker = {
		'interpreter': {
			'test': 'interp/test.js',
			'NRV': 'interp/NRV/NRV.js'
		}
	}
	Edith.init.passStep("var-worker")

	
	Edith.cmdArray = {
		"openWin": {"neededArg": [["win", "string"]]},
		"handleMenu": {"neededArg": [["action", "string"]]},
		"print": {"neededArg": [["text", "string"]]},
		"execCode": {},
		"closeWin": {}
	}
	Edith.init.passStep("var-commands")


	Edith.onChangeList = {
		"cmd": {
			"menuWinInput": {"opcode": "handleMenu", "arg": {"action": "getfeed"}}
		},
		"elem": [
			{"name": "menuWinInput", "dom": $("#menuWinInput")[0]}
		]
	}

	for (var i = 0; i < Edith.onChangeList["elem"].length; i++) {
		let elem = Edith.onChangeList["elem"][i]
		if (elem["dom"] != undefined) {
			elem["dom"].oninput = function(){
				Edith.handleOnChangeInput(Edith.onChangeList["cmd"][elem["name"]]);
			};
		}
	}

	Edith.init.passStep("var-misc")

})


Edith.init.newMilestone("Initialisation des pannels", ["pannels-all"], function() {

	Edith.domStatut = $('#statutbar-statut')[0];
	Edith.domCaractInfo = $('#statutbar-caractInfo')[0];

	Edith.createEditor($('#editor')[0]);
	Edith.domEditor = $('#editor')[0]

	Edith.createEditor($('#settingsEditor')[0]);

	Edith.domConsole = $('#console')[0];

	Edith.init.passStep("pannels-all")

})

Edith.init.newMilestone("Initialisation des keybinds", ["keys-all"], function() {

	document.onkeydown = Edith.handleKeyPress;
	document.onkeyup = Edith.setCaractInfo;
	Edith.domEditor.onclick = Edith.setCaractInfo;
	Edith.setCaractInfo();
	Edith.init.passStep("keys-all")
})

Edith.init.newMilestone("Initialisation du context menu", ["context-all"], function() {

	document.oncontextmenu = Edith.handleContextMenu;

	Edith.init.passStep("context-all")
	// console.log($(e.target).parents("#menuWin"))

})