/**
* Name: Eline Rietdijk
* Studentnumber: 10811834
* Project: D3 line
*
* 'd3line.js'
* This script ... NOG INVULLEN
**/

// define colors for different lines
//

var svg;
var above20;
var under20;
var line = [{
	"Normaalgewicht" : "",
	"Overgewicht" : "",
	"Ondergewicht" : "" 
}]

COLORS = [{
	"Normaalgewicht" : "rgb(51, 204, 51)",
	"Ondergewicht" : "rgb(204, 128, 51)",
	"Overgewicht" : "rgb(204, 51, 51)"
}]

var currentData;

var weightclasses = ["Normaalgewicht", "Ondergewicht", "Overgewicht"]


window.onload = function() {

	d3.json("rawData.json", function(error, data) {
		if (error) {
			alert("Could not load data")
			throw error;
		}
		createLine(data)
	});
}

function createLine(data) {

	// create arrays to store data for the group under and above 20 years old
	under20 = []
	above20 = []
	years = []
	
	//change all strings containing values to integers
	for (var i = 0; i < data.length; i++) {
		if(data[i].Leeftijd == "4 tot 20 jaar") {
			under20.push(data[i])
			years.push(data[i].Jaar)
		}
		else {
			above20.push(data[i])
		}
	}

	// under20 is currentData, because this option is selected at first 
	currentData = under20;

	// set margins for whitespace on sides of the graph
	var margin = {top: 20, right: 150, bottom: 50, left: 50},

		// set width and height of the graph, taking margins into account
		width = 1000 - margin.left - margin.right,
		height = 600 - margin.top - margin.bottom;

	// create x and y functions to scale coordinates
	var x = d3.scale.ordinal()
		.range([0, width])
		.domain(years)
		.rangeRoundBands([0, width])

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, 100])

	// create x and y-axis elements
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(function(d) {return d + "%"})

	// select svg element and create svg with appriopriate width and height
	svg = d3.select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

		// append g element with predefined margins
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add g element with x-axis
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)

		// append label with corresponding text 
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", 30)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "13")
		.text("Year")


	// add g element with y-axis 
	svg.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + 0 + ", 0)")
		.call(yAxis)

		// append label with corresponding text
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", - margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.style("font-size", "13")
		.text("percentage");

	// create variable selecting all ticks
	var ticks = d3.selectAll(".tick");

	// remove ticks except for every third
	ticks.attr("class", function(d, i) {
		if (i%2 != 0) d3.select(this).remove();
	});

	// create the lines for each weightclass using the current data
	createLines(x, y, svg, currentData, weightclasses[0])
	createLines(x, y, svg, currentData, weightclasses[1])
	createLines(x, y, svg, currentData, weightclasses[2])

	// append rectangles containing color for the legenda
	svg.selectAll("#legendaColors")
		.data(weightclasses)
		.enter().append("rect")
		.attr("id", "legenaColors")
		.attr("class", "legendaRect")
		.attr("x", width)
		.attr("y", function(d, i) {return 5 + 25 * i})
		.attr("width", 20)
		.attr("height", 20)

		// fill with color corresponding to region name
		.style("fill", function(d) {return COLORS[0][d]})

	// append rectangles containing color for the legenda
	svg.selectAll("#legendaTextbox")
		.data(weightclasses)
		.enter().append("rect")
		.attr("id", "legenaTextbox")
		.attr("class", "legendaRect")
		.attr("x", width + 25)
		.attr("y", function(d, i) {return 5 + 25 * i})
		.attr("width", 80)
		.attr("height", 20)
		.style("fill", "none")

	// create array containing text to be displayed at the legenda
	var legendaText = ["Normalweight", "Underweight", "Overweight"];

	// append text for the legenda
	svg.selectAll("#legendaText")
		.data(legendaText)
		.enter().append("text")
		.attr("id", "legenaText")
		.attr("class", "legenda")
		.attr("x", width + 35)
		.attr("y", function(d, i) {return 18 + 25 * i})
		.attr("width", 80)
		.attr("height", 20)
		.text(function(d) {return d})

	// create g element for the mouse interactivity
	var mouseG = svg.append("g")
		.attr("class", "interactivity")

	// append vertical line to g element to follow mouse
	mouseG.append("line")
		.attr("class", "pointerlLine")
		.attr("id", "pointerLine")
		.attr("x1", 0)
		.attr("x2", 0)
		.attr("y1", 0)
		.attr("y2", height)
		.style("stroke", "black")
		.attr("opacity", 1)

	// append rectangle to catch mouse movements on the screen
	mouseG.append("svg:rect")
		.attr("width", width)
		.attr("height", height)
		.attr("fill", "none")
		.attr("pointer-events",  "all")

		// on mouseout, remove or hide all pointer elements
		.on("mouseout", function() {
			mouseG.select("#pointerLine")
				.style("opacity", 0)
			mouseG.selectAll(".pointerText").remove()
			mouseG.selectAll(".pointerCircle").remove()
			mouseG.selectAll(".pointerRect").remove()
		})

		// on mouseover, show pointerLine
		.on("mouseover", function() {
			svg.select("#pointerLine")
				.style("opacity", 1)
		})

		// on mousemove, call createCrosshair function
		.on("mousemove", function() {
			var coordinates = d3.mouse(this);
			createCrosshair(coordinates, x, y, mouseG);
		})
}

function createLines(x, y, svg, data, weight) {

	//colors = [COLOR_NORMALWEIGHT, COLOR_UNDERWEIGHT, COLOR_OVERWEIGHT]

	line[weight] = d3.svg.line()
		.x(function(d) {return x(d.Jaar)})
		.y(function(d) {return y(d[weight])})

	svg.append("svg:path")
		.attr("d", line[weight](data))
		.attr("class", weight)
		.style("stroke", COLORS[0][weight])
	}

function updateData(value) {

	// set currentData to new dataset based on value
	if (value == "above20") {
		currentData = above20
	}
	else {
		currentData = under20
	}
	
	// create transition variable for the datachange
	var transition = svg.transition().duration(750),
		delay = function(d, i) {return i * 50};

	// for each weighclass, set d in line function to new dataset
	for(var i = 0; i < weightclasses.length; i++) {
		selection = weightclasses[i]
		transition.select("." + selection)
			.attr("d", line[selection](currentData))
	}
}

function createCrosshair(coordinates, x, y, mouseG) {

	// invert function is incompatible with ordinal scales
	xCoordinate = coordinates[0]

	// set pointerLine x to x-coordinates of mouse
	mouseG.select("#pointerLine")
		.attr("x1", coordinates[0])
		.attr("x2", coordinates[0])

	// initialize closest data value to the first value of current data
	closest = [currentData[0]]

	// iterate over data to find datapoint with x closest to mouse x
	for (var i = 0; i < currentData.length; i ++) {
		if ((Math.abs(x(currentData[i].Jaar) - xCoordinate)) < (Math.abs(x(closest[0].Jaar) - xCoordinate))) {
			closest[0] = currentData[i]
		}
	}

	// remove old pointerCircle before adding new
	mouseG.selectAll(".pointerCircle").remove()
	mouseG.selectAll(".pointerCircle")

		// for each weightclass, add circle element that follows mouse
		.data(weightclasses).enter()
		.append("circle")
		.attr("class", "pointerCircle")
		.attr("cx", coordinates[0])

		// set y and stroke to appropriate values for current weightclass		
		.attr("cy", function(d) {return y(closest[0][d])})
		.attr("r", 10)
		.style("fill", "none")
		.style("stroke", function(d) { return COLORS[0][d]})

	// remove old pointerRect before adding new
	mouseG.selectAll(".pointerRect").remove()
	mouseG.selectAll(".pointerRect")

		// for each weightclass, add a rect (to place value text on)
		.data(weightclasses).enter()
		.append("rect")
		.attr("class", "pointerRect")
		.attr("x", coordinates[0] + 10)

		// set y to y-coordinate of closest datapoint for each weightclass
		.attr("y", function(d) {return y(closest[0][d]) - 20})
		.attr("width", 20)
		.attr("height", 15)
		.attr("fill", "white")

	// remove old pointerText before adding new
	mouseG.selectAll(".pointerText").remove()
	mouseG.selectAll(".pointerText")

		// for each weightclass, add a text element that follows mouse
		.data(weightclasses).enter()
		.append("text")
		.attr("class", "pointerText")
		.attr("x", coordinates[0] + 10)

		// set y and text to appropriate values for current weightclass
		.attr("y", function(d) {return y(closest[0][d]) - 10})
		.text(function(d) {return closest[0][d]})
}