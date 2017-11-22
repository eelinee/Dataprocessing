/**
* Name: Eline Rietdijk
* Studentnumber: 10811834
* Project: Scatterplot
*
* 'scatterplot.js'
* NOG INVULLEN !!!!!!!
**/


window.onload = function() {

	d3.tsv("manual.txt", function(error, data) {
		if (error) throw error;

		console.log(typeof(data))
		createScatter(data)
	});
}

function createScatter(data) {

	var useData = [];
	// country = []
	// hdi = []
	// gii = []

	for (var i = 0; i < data.length; i ++) {
		if (data[i].HDI !== ".." && data[i].GII !== "..") {
			useData.push(data[i])
			// country[i] = data[i].Country
			// hdi[i] = data[i].HDI
			// gii[i] = data[i].GII
		}
	}
	console.log(data)
	console.log(useData)

	// set margins for whitespace on sides of the plot
	var margin = {top: 20, right: 30, bottom: 50, left: 40},

		// set width and height of the plot, taking margins into account
		width = 800 - - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	var x = d3.scale.linear()
		.range([0, width])
		.domain([0.3, 1])

	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, 0.9])

	var color = d3.scale.category20();

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	var svg = d3.select("body")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", margin.bottom / 2)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Human Development Index")

	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("x", 0)
		.attr("y", - margin.left)
		.attr("dy", ".71em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Gender Inequality Index")
	
	svg.selectAll(".dot")
		.data(useData)
		.enter().append("circle")
		.attr("class", "dot")
		.attr("r", 3.5)
		.attr("cx", function(d) { return x(d.HDI); })
		.attr("cy", function(d) { return y(d.GII); })
		.style("fill", function(d) { return color(d.Region); })


	// create an array containing only unique values for region
	var regions = []
	for (var i = 0; i < useData.length; i ++) {
		if (!regions.includes(useData[i].Region)) {
			regions.push(useData[i].Region)
		}
	}

	console.log(regions)

	// add rectangles containing colors for regions
	for (var i = 0; i < regions.length; i ++) {
		svg.append("rect")
		.attr("x", 30)
		.attr("y", 30)
		.attr("width", 20)
		.attr("height", 20)
		
		.style("fill", color(regions[i]))
	}
};