/**
* Name: Eline Rietdijk
* Studentnumber: 10811834
* Project: Scatterplot
*
* "test.js"
* This script creates a legenda with rectangles containing colors 
* and corresponding values for testing.
**/

window.onload = function() {
	d3.xml("test.svg", "image/svg+xml", function(error, xml) {
		if (error) throw error;    
		document.body.appendChild(xml.documentElement);
		testSVG()
	});	
} 



function testSVG() {

	// select svg element with id Laag_1
	var legenda = d3.select("#Laag_1")

	// set y of fourth text recte, original value does not fit
	d3.select("#tekst4").attr("y", "134.5")

	// add the 4 missing rectangles for color
	for (var i = 4; i < 8; i ++) {
		legenda.append("rect")
		.attr("id", "kleur" + i)
		.attr("x", "13")
		.attr("y", 13.5 + 40 * (i - 1))
		.attr("class", "st1")
		.attr("width", "21")
		.attr("height", "29")
	}

	// add missing 3 rectengles for text
	for (var i = 5; i < 8; i ++) {
		legenda.append("rect")
			.attr("id", "tekst" + i)
			.attr("x", "46.5")
			.attr("y", 13.5 + 40 * (i - 1))
			.attr("class", "st2")
			.attr("width", "119.1")
			.attr("height", "29")
	}

	// create color and text array containing info for legenda
	color = ["#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#005824", "#adad85"]
	text = ["100", "1000", "10000", "100000", "1000000", "10000000", "Data Unknown"]

	// add color and text to corresponding rectangles
	for (var i = 0; i < 8; i ++) {

		// select new element with id "kleur"
		d3.select("#kleur" + (i + 1))

			// fill with corresponding color
			.style("fill", color[i])

		// add text area to legenda
		legenda.append("text")

			// x-value is the same for each text area
			.attr("x", "46.5")

			// y-value changes with 40 per rectangle
			.attr("y", 33.5 + 40 * i)

			// fill with corresponding text
			.text(text[i])
		}
}