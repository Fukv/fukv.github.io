function gameLoop(lastUpdate) {

	var delta = performance.now() - lastUpdate
	var lastUpdate = performance.now()

	tick++

	update(delta, tick);
	render(delta, tick);

	window.requestAnimationFrame(function() {gameLoop(lastUpdate)})
}

function load() {
	elCanvas = document.getElementById('canvas');
	function setSizeCanvas() {
		elCanvas.height = window.innerHeight;
		elCanvas.width  = window.innerWidth;
		ctx.height = window.innerHeight; // to get width in render() or update()
		ctx.width = window.innerWidth;
	}

	ctx = elCanvas.getContext('2d');

	setSizeCanvas()
	window.addEventListener("resize", setSizeCanvas)

	tick = 0

	gameLoop(performance.now())
}

function getRandom(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}

function getIntersection(ray, segment)

function update(delta, tick) {
	fps = (1 / (delta / 1000)).toFixed(2);



}

function render(delta, tick) {
	ctx.clearRect(0, 0, ctx.width, ctx.height)

	ctx.fillStyle = "#FFF";
	ctx.fillText("FPS: " + fps, 10, 10)

}
