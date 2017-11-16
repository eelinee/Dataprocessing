window.onload = function() {

	// change background color of webpage to "whitesmoke"
	d3.selectAll("*").style("background-color", "whitesmoke");

	// load raw data file containing temperatures in de Bilt, 2014
	d3.json("rawData.json", function(data) {

		// calculate the monthly mean of just loaded data
		monthlyMean = calcMonthlyMean(data);
		console.log(monthlyMean)

		// create barchart of monthly mean
		createBarChart(monthlyMean);
	});
}

function createBarChart(monthlyMean) {
	// create empty variable to store month names
	months = []

	// create empty variable to store mean temps
	mean = []

	// fill date and mean arrays
	for (var i = 0; i < monthlyMean.length; i++) {
		mean[i] = Math.round(monthlyMean[i].mean)
		months[i] = monthlyMean[i].month
	}

	// DIT ALLEMAAL VAN DIE BARCHART 2 UITLEG!!!

	// set margins for whitespace on sides of the chart
	var margin = {top: 20, right: 30, bottom: 50, left: 40},

		// set width and height of the chart, taking margins into account
		width = 800 - - margin.left - margin.right,
		height = 500 - margin.top - margin.bottom;

	// create y function to scale values for y-axis
	var y = d3.scale.linear().range([height, 0]);

	// create x function to scale ordinal values, because x-values are month names
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], 0.05);

	// include domain for y-values (min and max of mean temp)
	y.domain([0, d3.max(mean)]);

	// include domain for x-values, which are months
	x.domain(months);

	// create chart with desired width and height
	var chart = d3.select(".chart")
		.attr("width", width + + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.right + ")");

	// calculate barwidth, based on width and amount of bars (mean.length)
	var barWidth = width / mean.length

	console.log("b")

	// create 'g' element for each data point on x-axis
	var bar = chart.selectAll("g")
		.data(mean).enter()
		.append("g")
		.attr("transform", function(d, i) {return "translate(" + i * barWidth + "," + 0 + ")"; });
	
	// create bar (rect) for each datapoint with corresponding scaled height
	bar.append("rect")
		.attr("y", function(d) {return y(d); })
		.attr("height", function(d) {return height - y(d); })
		.attr("width", x.rangeBand())
	
	// add text containing corresponding value to the top of the bar
	bar.append("text")
		.attr("x", barWidth / 2)
		.attr("y", function(d) {return y(d) + 3; })
		.attr("dy", ".75em").text(function(d) {return d; });

	// create x-axis based on scale and oriented at the bottom
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// append x-axis to the chart
	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", width)
		.attr("y", .75 * margin.bottom)
		.style("text-anchor", "end")
		.text("month, 2014");

	// append text labels as legenda
	chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + 0 + ", 0)")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", - margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("temperature in degrees Celcius");
};

function type(d) {
	d.value = +d.value // coerce to number
	return d;
}
	// TOT AAN HIER 

function calcMonthlyMean(data) {
	console.log(data.length)
	// create empty array to store temperature values
	temp = [];

	// create empty array to store date values
	date = [];

	// fill date and temp arrays
	for (var i = 0; i < data.length; i++) {
		temp[i] = parseInt(data[i].maxTemp) / 10
		date[i] = data[i].date
	}

	// calculate mean max temerature for each month
	var monthlyMean = [];
	var monthTemp = [];
	var counterMonth = 0;
	var total = 0;
	var prevMonth = 1;
	var counterDay = 0
	var months = ["Januari", "Februari", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	for (var i = 0; i < temp.length; i++) {
		if (date[i][5] != prevMonth || i == temp.length - 1) {
			monthTemp[counterMonth] = total/counterDay
			total = 0;
			counterMonth ++;
			counterDay = 0;
		}
		counterDay ++;
		total += temp[i];
		prevMonth = date[i][5]
	}

	for (var j = 0; j < 12; j ++) {
		monthlyMean.push({"month": months[j], "mean": monthTemp[j]});
	}
	return monthlyMean
}
	
