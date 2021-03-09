function makeShadow(px, aprox = 1) {
	// to make a good shadow we can make a lot of text-shadow with different offset
	// there is maybe a wayyy better way to do that but this one is working

	// px is width of the shadow
	// aprox is the step between each shadow (1 is good, 3+ is ugly)

	var prop = "";
	var steps = px / aprox;
	for (var i = 1; i <= steps; i++) {
		let delim = (i >= steps)? "" : ",";

		prop += `${(i * aprox * 1.2).toFixed(5)}px ${i * aprox}px 0 white${delim} `;
	}

	document.getElementsByClassName("shadEffect-text")[0].style.textShadow = prop
	return prop
}

// var i =
// int = setInterval(function() {
// 	makeShadow()
// }, 500);
//
//
//
// iInt = 0
// int = setInterval(function() {
// 	if(i < 30)
// 	makeShadow(i)
// }, 500);

// for()

grow = true

function launchAnim(grow) {

	max = 20
	min = 1
	iInt = min
	int = setInterval(function() {
		iInt++

		if(iInt > max - min) {
			clearInterval(int)
			grow = !grow
			launchAnim(grow)
		}

		if(grow) {
			makeShadow(iInt)
		} else {
			makeShadow(max - iInt)
		}
	}, 50)

}
