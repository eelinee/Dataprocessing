/**
* Name: Eline Rietdijk
* Studentnumber: 10811834
* Project: Scatterplot
*
* 'scatterplot.js'
* This script creates a scatterplot depicting the relation between the 
* Human Developmental Index and the Gender Inequality Index in 159 countries.
**/


window.onload = function() {

	d3.tsv("rawdata.txt", function(error, data) {
		if (error) throw error;

		createScatter(data)
	});
}

function createScatter(data) {

	// create variable to store data to create scatterplot
	var useData = [];

	// iterate through datafile
	for (var i = 0; i < data.length; i ++) {

		// don't push data lines with missing data (represented with '..')
		if (data[i].HDI !== ".." && data[i].GII !== "..") {
			useData.push(data[i])
		}
	}

	// set margins for whitespace on sides of the plot
	var margin = {top: 20, right: 30, bottom: 50, left: 40},

		// set width and height of the plot, taking margins into account
		width = 800 - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// create x function to scale x-coordinates
	var x = d3.scale.linear()
		.range([0, width])
		.domain([0.3, 1])

	// create y function to scale y-coordinates
	var y = d3.scale.linear()
		.range([height, 0])
		.domain([0, 0.9])

	// create color function to determine color for the dots
	var color = d3.scale.category10();

	// create x-axis element
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	// create y-axis element
	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// select svg element, taking into account predined width and height
	var svg = d3.select("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)

		// append g element, taking into account predefined margins
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// add x-axis to g element
	svg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)

		// append label with corresponding text 
		.append("text")
		.attr("class", "label")
		.attr("x", width)
		.attr("y", margin.bottom / 2)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Human Development Index")

	// add y-axis to g element
	svg.append("g")
		.attr("class", "y axis")
		.call(yAxis)

		// append label with corresponding text 
		.append("text")
		.attr("class", "label")
		.attr("x", 0)
		.attr("y", - margin.left)
		.attr("dy", ".71em")
		.attr("transform", "rotate(-90)")
		.style("text-anchor", "end")
		.text("Gender Inequality Index")

	// create d3 tip
	var tip = d3.tip()
		.attr("class", "d3-tip")
		.offset([0, 0])

		// tip should display corresponding datavalues 
		.html(function(d, i) {
			return "<p><strong>" + d.Country + "</strong></p><p><text>(" 
				+ Math.round(d.GII * 100) / 100 + "," + Math.round(d.HDI * 100) / 100 
				+ ") </text></p>" 
		})

	svg.call(tip)

	// append line from datapoint to corresponding point on x-axis
	d3.select("svg").selectAll(".xline")
		.data(useData)
		.enter().append("line")
		.attr("class", "xline")
		.attr("id", function(d, i) {return "line" + i})
		.attr("x1", function(d, i) {return x(d.HDI) + 40})
		.attr("x2", function(d, i) {return x(d.HDI) + 40})
		.attr("y1", function(d, i) {return y(d.GII) + 30})
		.attr("y2", height + margin.bottom / 2 - 5)
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.attr("opacity", 0)

	// append line from datapoint to corresponding point on y-axis
	d3.select("svg").selectAll(".yline")
		.data(useData)
		.enter().append("line")
		.attr("class", "yline")

		// set id as datapoint number
		.attr("id" , function(d, i) {return "line" + i})
		.attr("x1", margin.left)
		.attr("x2", function(d, i) {return x(d.HDI) + margin.left - 10})
		.attr("y1", function(d, i) {return y(d.GII) + 20})
		.attr("y2", function(d, i) {return y(d.GII) + 20})
		.attr("stroke-width", 1)
		.attr("stroke", "black")
		.attr("opacity", 0)
	
	// append dot for each datapoint
	svg.selectAll(".dot")
		.data(useData)
		.enter().append("circle")

		// set id as region name
		.attr("id", function(d, i) {return d.Region})
		.attr("class", "dot")
		.style("stroke-widt", "2px")
		.attr("r", 6)

		// set x- and y coordinates using corresponding scale function
		.attr("cx", function(d) { return x(d.HDI); })
		.attr("cy", function(d) { return y(d.GII); })
		.style("fill", function(d) { return color(d.Region); })
		.on("mouseover", function(d, i) {

			// on mouseover, show tip containing corresponding values
			tip.show(d);

			// increase dot radius
			d3.select(this).attr("r", 10)

			// decrease opacity for all dots except for current
			var self = this
			d3.selectAll(".dot").filter(function(x) {return self != this; })
				.style("opacity", .2)

			// show lines to corresponding point on x- and y-axis
			d3.selectAll("#line" + i)
				.attr("opacity", 1)
		})
		.on("mouseout", function(d, i) {

			// on mouseout, hide tip containing corresponding values
			tip.hide(d);
			d3.select(this).attr("r", 6)
			
			// increase opacity for all dots (if opacity was less than 1)
			d3.selectAll(".dot")
				.style("opacity", 1)

			// hide lines to corresponding point on x- and y-axis
			d3.selectAll("#line" + i)
				.attr("opacity", 0)
		})


	// create an array containing only unique values for region
	var regions = []
	for (var i = 0; i < useData.length; i ++) {
		if (!regions.includes(useData[i].Region)) {
			regions.push(useData[i].Region)
		}
	}

	// append rectangles containing colr for the legenda
	d3.select("svg").selectAll(".colors")
		.data(regions)
		.enter().append("rect")

		// set id as region name
		.attr("id", function(d, i) {return d})
		.attr("class", "colors")
		.attr("x", width - 90)
		.attr("y", function(d, i) {return 10 + 25 * i})
		.attr("width", 20)
		.attr("height", 20)

		// fill with color corresponding to region name
		.style("fill", function(d, i) {return color(d)})
		.on("mouseover", function(d, i) {

			// on mouseover, decrease opacity for all color rectangles
			d3.selectAll(".colors")
				.style("opacity", 0.2)

			// on mouseover, decrease opacity for all dots
			d3.selectAll(".dot")
				.style("opacity", 0.2)

			// but set opacity to 1 for elements with current region as id 
			d3.selectAll("#" + d)
				.style("opacity", 1)
		})
		.on("mouseout", function(d, i) { 

			// on mouseout, set opacity for all dots and rects to 1
			d3.selectAll(".colors")
				.style("opacity", 1) 
			d3.selectAll(".dot")
				.style("opacity", 1)
		})
	
	// append rectangles containing region name for legenda
	d3.select("svg").selectAll(".text")
		.data(regions)
		.enter().append("rect")
		.attr("class", "text")
		.attr("x", width - 60)
		.attr("y", function(d, i) {return 10 + 25 * i})
		.attr("width", 80)
		.attr("height", 20)

	// add corresponding region name to rects
	d3.select("svg").selectAll(".country")
		.data(regions)
		.enter().append("text")
		.attr("class", "country")
		.attr("x", width -57)
		.attr("y", function(d, i) {return 25 + 25 * i})
		.text(function(d, i) {return d})
};
