function gameLoop() {

	delta = performance.now() - gL_lastUpdate;
	gL_lastUpdate = performance.now();

	tick++;

	update(delta, tick);
	render(delta, tick);

	window.requestAnimationFrame(gameLoop)

}

function load() {

	gL_lastUpdate = 0;
	fps = 0;
	tick = 0;
	generation = 0;
	debug = true;
	doLife = true;
	affGrid = false;

	xNum = 200
	yNum = 100
	matrix = []
	nextMatrix = []

	createGrid('white')

	buddySize = Math.round(canvas.height / matrix.length)

	// matrix[1][2] = 1
	// matrix[2][3] = 1
	// matrix[3][1] = 1
	// matrix[3][2] = 1
	// matrix[3][3] = 1

	canvas = document.getElementById("canvas")
	ctx = canvas.getContext("2d");

	gameLoop();
}

function createGrid(mode) {

	for (var iVert = 0; iVert < yNum; iVert++) {
		
		matrix[iVert] = []

		for (var iHori = 0; iHori < xNum; iHori++) {

			if (mode == "random") {
				matrix[iVert][iHori] = Math.round(Math.random())
			} else if (mode == "void") {
				matrix[iVert][iHori] = 0
			} else if (mode == "white"){
				matrix[iVert][iHori] = 1
			} else {
				matrix[iVert][iHori] = 0
			}

		}
	}

}

function getHood(y, x) {

	theHood = 0

	for (var yi = y-1; yi <= y+1; yi++) {
		for (var xi = x-1; xi <= x+1; xi++) {
			if ( !(yi == y && xi == x) ) {
				if (typeof matrix[yi] != "undefined") {
					if (matrix[yi][xi]) {
						theHood++
					}
				}
			}
		}
	}
	return theHood;
}

function update(delta, tick) {

	if ( !(tick%10) ) {
		fps = (1 / (delta / 1000)).toFixed(2);
	}

	if (doLife) {
		nextMatrix = []
		for(var i = 0; i < matrix.length; i++) {
			nextMatrix[i] = [...matrix[i]]
		}

		for (var iVert = 0; iVert < matrix.length; iVert++) {
			for (var iHori = 0; iHori < matrix[iVert].length; iHori++) {

				theHood = getHood(iVert, iHori) 

				if (matrix[iVert][iHori] == 1) {
					if (theHood < 2 || theHood > 3) {
						nextMatrix[iVert][iHori] = 0
					}
				} 

				if (matrix[iVert][iHori] == 0) {
					if (theHood == 3) {
						nextMatrix[iVert][iHori] = 1
					}
				}
			}
		}

		matrix = [...nextMatrix];
		delete nextMatrix

		generation++
	}

}

function render(delta, tick) {

	ctx.fillStyle = "#FFF";

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillText("FPS: " + fps, canvas.width-100, 10)
	ctx.fillText("Generation: " + generation, canvas.width-100, 20)


	for (var iVert = 0; iVert < yNum; iVert++) {
		for (var iHori = 0; iHori < xNum; iHori++) {

			if (matrix[iVert][iHori]) {
				ctx.fillRect(buddySize * iHori, buddySize * iVert, buddySize, buddySize)
			}

		}
	}

	if (affGrid) {
		ctx.fillStyle = "#202020";
		for (var iVert = 0; iVert <= yNum; iVert++) {
			ctx.fillRect(0, buddySize * iVert, buddySize * xNum, 1)
		}
		for (var iHori = 0; iHori <= xNum; iHori++) {	
			ctx.fillRect(buddySize * iHori, 0, 1, buddySize * yNum)
		}
		ctx.fillStyle = "#FFF";
	}

	
}

function clickCanvas(e) {
	cellX = Math.floor( (e.x - canvas.offsetLeft) / buddySize)
	cellY = Math.floor( (e.y - canvas.offsetTop ) / buddySize)

	console.log(e);

	if (typeof matrix[cellY] != "undefined") {
		if (matrix[cellY][cellX]) {
			matrix[cellY][cellX] = 0
		} else {
			matrix[cellY][cellX] = 1
		}
	}

	
}

function keyCanvas(e) {

	if (e.key == " ") {
		if (doLife) {
			doLife = false
		} else {
			doLife = true
		}
	} else if (e.key == "c") {
		createGrid("void")
	} else if (e.key == "g") {
		if (affGrid) {
			affGrid = false
		} else {
			affGrid = true
		}	
	}

}