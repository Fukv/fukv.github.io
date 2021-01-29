/* 

NRVv1
By INSYCO_NESH
With <3

*/ 

onmessage = function(e) {

	if (typeof e.data["code"] == "string") {
		execute(getC(e.data["code"]))
	}
}

function EdithPrint(toPrint) {
	postMessage(toPrint);
}

// FUNCTIONs SYS //

memoire = [] 	// Contient tout l'environnement mémoire du programme
isError = false // contient true lorsque une erreure se déclanche, pour arreter les loops

function getMem(adr) {	// fonction qui va voir dans la mémoire
	ret = memoire[adr]

	if (ret == undefined) { // permet de renvoyer 0 si la case mémoire n'a pas été définie
		ret = 0
	}

	return ret
}

function error(errorCode, location) { // Fonction qui gère les erreurs 
	isError = true	// pour ne pas continuer les loops après une erreur

	var explain = ""
	if (errorCode == 100) {
		explain = "L'unit visé n'est pas un opcode"
	} else if (errorCode == 101) {
		explain = "L'arg ne correspond pas a l'opcode demandé"
	} else if (errorCode == 102) {
		explain = "L'opcode a une longueur inattendu (normalement 4 caractères)"
	} else if (errorCode == 103) {
		explain = "L'arg a une longueur inattendu (normalement 6 caractères)"
	} else if (errorCode == 104) {
		explain = "L'unit visé n'est pas un nombre" 
	} else if (errorCode == 105) {
		explain = "Les seconds args des instructions 1ope doivent toujours etre 9x0000, l'arg visé ne respecte pas la règle"
	} else if (errorCode == 106) {
		explain = "L'instruction a une longueur inattendu (normalement 3 units)"
	} else if (errorCode == 200) {
		explain = "L'opcode n'est pas reconnu"
	} else {
		explain = "erreur inconnue"
	}

	document.getElementById("errorRep").innerHTML = '<h1 style="text-align: center">Erreur ' + errorCode + '</h1><legend style="text-align: center; font-size: 16px;">' + location + '</legend><p style="text-align: center">' + explain + '</p>'
	daWindow(true, "error")

	console.log("%cErreur", "color: red;", "(" + errorCode + ", " + location + "):" + " " + explain)
}

// FUNCTION GET CODE//

function getC(code) { // transforme le code raw, en code utilisable en array
	
	console.time("Temps d'execution"); // note le début de l’exécution

	memoire = []	// remise a zero après execution
	isError = false

	code = code.replace(/\r?\n|\r/g, " ")

	console.log(code)
	var nbrUnit = 0, codeRet = [0], codeTemp = [], codeTemp2 = [] 
	//  nbrUnit : un conteur d'unit pour s’arrêter a 3 et recommencer
	//  codeRet : l'array qui va être retourné par la fonction

	code = code.split(" ") // met le raw en un array délimité par les espaces
	for(i = 0, c = code.length; i < c; i++) {	// supprime les items vides
		if(code[i] != "") {
			codeTemp.push(code[i])
		} 
	}
	for(var i = 0, c = codeTemp.length; i < c; i++) {
		
		nbrUnit++
		codeTemp2.push(codeTemp[i])
		if (nbrUnit == 3) {
			nbrUnit = 0
			codeRet.push(codeTemp2)
			codeTemp2 = []
		}
	}
	if (codeTemp2 != "") {
		codeRet.push(codeTemp2)
	}
	
	/*
	XxXX XxXXXX XxXXXX XxXX XxXXXX XxXXXX
	transformé en :
	[
		[
			"XxXX",
			"XxXXXX",
			"XxXXXX"
		], 
		[
			"XxXX",
			"XxXXXX",
			"XxXXXX"
		]
	] 
	*/

	console.log(codeRet)
	return codeRet
}

// FUNCTION EXECUTE //

function execute(code) {

	function ope1(opcode, arg1, arg2) {
		if (["1", "2"].indexOf(arg1[0]) != -1) { // 
			if (["1", "2"].indexOf(arg2[0]) != -1) {
				
				var ocAftx = opcode[2] + opcode[3] // créait des variable contenant seulement l'Aftx
				var arg1Aftx = Number(arg1[2] + arg1[3] + arg1[4] + arg1[5])
				var arg2Aftx = Number(arg2[2] + arg2[3] + arg2[4] + arg2[5])

				if (arg1[0] == "2") { arg1Aftx = getMem(arg1Aftx) } // traduit la ref en la bonne valeur pour l'arg 1
				if (arg2[0] == "2") { arg2Aftx = getMem(arg2Aftx) } // la même chose pour l'arg 2

				// commence l’exécution 
				if (ocAftx == "00") { 									// STOR
					console.log("STOR " + arg1Aftx + " " + arg2Aftx)
					memoire[arg2Aftx] = arg1Aftx
				} else if (ocAftx == "01") { 							// MOV
					console.log("MOV " + arg1Aftx + " " + arg2Aftx)
					memoire[arg2Aftx] = memoire[arg1Aftx]
					memoire[arg1Aftx] = undefined
				} else if (ocAftx == "02") { 							// COP
					console.log("COP " + arg1Aftx + " " + arg2Aftx)
					memoire[arg2Aftx] = memoire[arg1Aftx]


				} else if (ocAftx == "10") { 							// ADDT
					console.log("ADDT " + arg1Aftx + " " + arg2Aftx)
					memoire[1] = arg1Aftx + arg2Aftx
				} else if (ocAftx == "11") { 							// SOUS
					console.log("SOUS " + arg1Aftx + " " + arg2Aftx)
					memoire[1] = arg1Aftx - arg2Aftx
				} else if (ocAftx == "12") {  							// MULT
					console.log("MULT " + arg1Aftx + " " + arg2Aftx)
					memoire[1] = arg1Aftx * arg2Aftx
				} else if (ocAftx == "13") {  							// DIVI
					console.log("DIVI " + arg1Aftx + " " + arg2Aftx)
					memoire[1] = arg1Aftx / arg2Aftx


				} else if (ocAftx == "20") {  							// EQU
					console.log("EQU " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx == arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				} else if (ocAftx == "21") {  							// DIFF
					console.log("DIFF " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx != arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				} else if (ocAftx == "22") {  							// SUP
					console.log("SUP " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx > arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				} else if (ocAftx == "23") {  							// INF
					console.log("INF " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx < arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				} else if (ocAftx == "24") {  							// SUPE
					console.log("SUPE " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx >= arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				} else if (ocAftx == "25") {  							// INFE
					console.log("INFE " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx <= arg2Aftx) 
						{memoire[2] = 1} else {memoire[2] = 0}
				

				} else if (ocAftx == "30") {  							// AND
					console.log("AND " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx && arg2Aftx) 
						{memoire[3] = 1} else {memoire[3] = 0}
				} else if (ocAftx == "31") {  							// OR
					console.log("OR " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx || arg2Aftx) 
						{memoire[3] = 1} else {memoire[3] = 0}
				} else if (ocAftx == "32") {  							// XOR
					console.log("XOR " + arg1Aftx + " " + arg2Aftx)
					if ((arg1Aftx && !arg2Aftx) || (!arg1Aftx && arg2Aftx)) 
						{memoire[3] = 1} else {memoire[3] = 0}
				
				} else if (ocAftx == "40") {  							// IF
					console.log("IF " + arg1Aftx + " " + arg2Aftx)
					if (arg1Aftx) {memoire[0] = memoire[0] + arg2Aftx - 1}
				} else if (ocAftx == "41") {  							// IFN
					console.log("IFN " + arg1Aftx + " " + arg2Aftx)
					if (!arg1Aftx) {memoire[0] = memoire[0] + arg2Aftx - 1}
						console.log(!arg1Aftx)
				}
			
			} else {
				error(101, (memoire[0]) + ":3")
				
			}
		} else {
			error(101, (memoire[0]) + ":2")
			
		}
	}

	function ope2(opcode, arg1, arg2) {
		if (["1", "2"].indexOf(arg1[0]) != -1) {
			if (arg2 == "9x0000") {
				
				ocAftx = opcode[2] + opcode[3]
				arg1Aftx = Number(arg1[2] + arg1[3] + arg1[4] + arg1[5])
				if (arg1[0] == "2") { arg1Aftx = getMem(arg1Aftx) } // go chercher la valeur a l'adresse arg1


				if (ocAftx == "33") { // NOT
					console.log("NOT " + arg1Aftx)
					if (!arg1Aftx) {memoire[3] = 1} else {memoire[3] = 0}
				} else if (ocAftx == "42") { // GOTOR
					console.log("GOTOR " + arg1Aftx)
					memoire[0] = memoire[0] + arg1Aftx
				} else if (ocAftx == "43") { // GOTOA
					console.log("GOTOA " + arg1Aftx)
					memoire[0] = arg1Aftx
				} else if (ocAftx == "51") { // PRINT
					console.log("PRINT " + arg1Aftx)
					EdithPrint(String.fromCharCode(Number(arg1Aftx)))
				}

			} else {
				error(105, (memoire[0]) + ":3")
			}
		} else {
			error(101, (memoire[0]) + ":2")
		}
	}

	for (memoire[0] = 1, cLen = code.length; memoire[0] < cLen && !isError; memoire[0]++) { // memoire[0] = CodePointer
		
		var opcode = code[memoire[0]][0],
		arg1 = code[memoire[0]][1],
		arg2 = code[memoire[0]][2]

		// quelques tests 

		if (code[memoire[0]].length != 3) { 		error(106, (memoire[0] + ":0")) } 
		if (!isError) {
			if (opcode[0] != "0") { 				error(100, (memoire[0] + ":1")) } // regarder si le premier unit est bien un opcode
			if (opcode.length != 4) { 				error(102, (memoire[0] + ":1")) } // regarder si la longueur de l'opcode est bien 4
			if (arg1.length != 6) { 				error(103, (memoire[0] + ":2")) } // regarder si l'arg 1 fait bien 6 de longueur
			if (arg2.length != 6) { 				error(103, (memoire[0] + ":3")) } // la même pour l'arg 2
			if (isNaN(Number(opcode.slice(2)))) { 	error(104, (memoire[0] + ":1")) } // regarder si l'opcode est bien un nombre
			if (isNaN(Number(arg1.slice(2)))) { 	error(104, (memoire[0] + ":2")) } // la même mais pour l'arg 1
			if (isNaN(Number(arg2.slice(2)))) { 	error(104, (memoire[0] + ":3")) } // pour l'arg 2

			if (["00", "01", "02", "10", "11", "12", "13", "20", "21", "22", "23", "24", "25", "30", "31", "32", "40", "41"].indexOf(opcode[2] + opcode[3]) != -1 && !isError) { // tout les ope1

				ope1(opcode, arg1, arg2)

			} else if (["33", "42", "43", "51"].indexOf(opcode[2] + opcode[3]) != -1 && !isError) { // les gotos
				ope2(opcode, arg1, arg2)
			} else {
				if (!isError) {
					error(200, memoire[0] + ":0")
				}
			}
		}

		
	}

	console.log(memoire)

	console.timeEnd("Temps d'execution")

}