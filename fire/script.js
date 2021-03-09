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
	elCanvas.addEventListener("mousemove", function (event) {
		console.log(event.clientX, event.clientY)
	})

	tick = 0

	gameLoop(performance.now())
}

function getRandom(min, max) {
	return Math.round(Math.random() * (max - min) + min)
}

class Particle {
	constructor() {
		this.xpos = getRandom((ctx.width/2)-30, (ctx.width/2)+30)
		this.ypos = getRandom((ctx.height/2)-30, (ctx.height/2)+30)
		this.size = getRandom(10, 50)
		this.color = [255, 165, 0]
	}
}

particlesArray = [

]

function update(delta, tick) {
	fps = (1 / (delta / 1000)).toFixed(2);

	particlesArray.forEach((particle, key) => {

		if(particle.xpos > ctx.width/2 + 20) {
			particle.xpos -= getRandom(0.1, 1)
		} else if (particle.xpos < ctx.width/2 - 20) {
			particle.xpos += getRandom(0.1, 1)
		} else {
			particle.xpos += getRandom(-1, 1)
		}
		particle.ypos -= 3
		particle.size -=  getRandom(0, 1)

		particle.color = [
			particle.color[0],
			particle.color[1] - getRandom(0, 2),
			particle.color[2]
		]

		if (particle.size < 0) {
			delete particlesArray.splice(key, 1)
		}
	});

	for (var i = 0; i < 5; i++) {
		particlesArray.push(new Particle)
	}

}

function render(delta, tick) {
	ctx.clearRect(0, 0, ctx.width, ctx.height)

	ctx.fillStyle = "#FFF";
	ctx.fillText("FPS: " + fps, 10, 10)

	particlesArray.forEach((particle, key) => {
		ctx.fillStyle = "rgb(" + particle.color[0] + "," + particle.color[1] + "," + particle.color[2] + ")";
		ctx.beginPath();
		ctx.arc(particle.xpos, particle.ypos, particle.size/2, 0, 2 * Math.PI);
		ctx.closePath();
		ctx.fill();
	})

}
