/* Name: Eline Rietdijk
Studentnumber: 10811834

'linked.js'
This file is used in 'linked.html' to create two linked data visualisations:
a map of the Netherlands and a barchart.*/

// var provinces;
// var chartSvg;
// var currentData;
// var y;
// var x;
// var chartHeight;
// var margin;
// var height;
// var width;

window.onload = function() {
	
	// load datasets using a queue 
	d3.queue()
	.defer(d3.csv, "netherlandsTotalCrime.csv")
	.defer(d3.csv, "netherlandsRelativeCrime.csv")
	.defer(d3.json, "netherlands.json")
	.await(createVisualisation)
}

function createVisualisation(error, totalCrime, relativeCrime, nld) {
	
	var Groningen = ["Groningen"];
	var Friesland = ["Friesland"];
	var Drenthe = ["Drenthe"];
	var Overijssel = ["Overijssel"];
	var Flevoland = ["Flevoland"];
	var Gelderland = ["Gelderland"];
	var Utrecht = ["Utrecht"];
	var NoordHolland = ["Noord-Holland"];
	var ZuidHolland = ["Zuid-Holland"];
	var NoordBrabant = ["Noord-Brabant"];
	var Limburg = ["Limburg"];
	var Zeeland = ["Zeeland"];

	provinces = [Groningen, Friesland, Drenthe, Overijssel, Flevoland, Gelderland, 
		Utrecht, NoordHolland, ZuidHolland, NoordBrabant, Limburg, Zeeland]

	for (i = 0; i < provinces.length; i ++) {
		for(j = 0; j < relativeCrime.length; j ++) {
			if (provinces[i][0] == relativeCrime[j].Provincie) {
				provinces[i].push(relativeCrime[j])
				}
			}
		provinces[i].splice(0, 1)
	}

	currentData = provinces[11];

	// set margins for whitespace on sides of the graph
	margin = {top: 10, right: 30, bottom: 70, left: 75},

		// set width and height of the total svg
		width = 1300
		height = 600

	createMap(totalCrime, nld)
	createChart()
}

function createMap(totalCrime, nld) {

	mapWidth = width / 2 - 200

	// select svg element and create svg with appriopriate width and height
	var mapSvg = d3.select(".mapSvg")
		.append("svg")
		.attr("width", mapWidth)
		.attr("height", height);

	var g = mapSvg.append("g")

	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

	var path = d3.geo.path()
		.projection(projection);

	var mapTip = d3.tip()
		.attr("class", "tip")
		.attr("id", "mapTip")
		.offset([-10, 50])
		.html(function(d, i) {
			return "<text style='color:red'>"+ d.RegioS +":</text><div><text>" + d.GeregistreerdeMisdrijvenPer1000Inw_3 + " misdrijven / 1000 inw.</text></div>";
		})

	mapSvg.call(mapTip);

	var mapValues = [40, 45, 50, 55, 60, 65, 75];
	var mapColors = ["#ffe6e6", "#ffb3b3", "#ff8080", 
			"#ff4d4d", "#ff1a1a", "#ff0000", "#ff0000"];

	var map_colors = d3.scale.quantize()
		.domain(mapValues)
		.range(mapColors);


	// create map of the Netherlands using nld.json
	g.selectAll("path")
		var l = topojson.feature(nld, nld.objects.subunits).features[3],
			b = path.bounds(l),
			s = .2 / Math.max((b[1][0] - b[0][0]) / (mapWidth + 200), (b[1][1] - b[0][1]) / (height + 200)),
			t = [(mapWidth - 200 - s * (b[1][0] + b[0][0])) / 2, ((height + 115) - s * (b[1][1] + b[0][1])) / 2];
		
		projection
			.scale(s)
			.translate(t)

		g.selectAll("path")
			.data(topojson.feature(nld, nld.objects.subunits).features).enter()
			.append("path")
			.attr("d", path)
			.attr("stroke", "black")
			.attr("id", "location")
			.attr("class", function(d, i) {
				return d.properties.name;
			})
			.attr("fill", function(d, i) {
				if (d.properties.name != null) {
					for (var j = 0; j < totalCrime.length; j ++) {
						if (totalCrime[j].RegioS == d.properties.name) {
							value = totalCrime[j]
						}
					}
					return map_colors(value.GeregistreerdeMisdrijvenPer1000Inw_3);
				}
				else {
					return "grey"
				}
			})		
			.on("mouseover", function(d, i) {
				for (var j = 0; j < totalCrime.length; j ++) {
						if (totalCrime[j].RegioS == d.properties.name) {
							value = totalCrime[j]
						}
					}
				mapTip.show(value, i)
			})
			.on("mouseout", function(d, i) {
				mapTip.hide(d, i)
			})
			.on("click", function(d, i) {
				clickEvent(d.properties.name)
			})

	// create legenda for map
	mapSvg.selectAll("#mapLegendaColors")
		.data(mapColors)
		.enter().append("rect")
		.attr("id", "mapLegendaColors")
		.attr("class", "legenda")
		.attr("x", 10)
		.attr("y", function(d, i) {return 25 + 25 * i})
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", function(d) {return d})

	mapSvg.selectAll("#mapLegendaText")
		.data(mapValues)
		.enter().append("text")
		.attr("id", "mapLegendaText")
		.attr("class", "legenda")
		.attr("x", 35)
		.attr("y", function(d, i) {return 40 + 25 * i})
		.text(function(d, i) {return d})

	mapSvg.append("text")
		.attr("class", "legenda")
		.attr("x", 3)
		.attr("y", 15)
		.text("Aantal misdrijven per 1000 inwoners:")
}

function createChart() {
	
	// set width of individual elements
	chartWidth = width / 2 + 200 - margin.left - margin.right
	chartHeight = height - margin.top - margin.bottom

	// create svg for chart
	chartSvg = d3.select(".chartSvg")
		.append("svg")
		.attr("width", chartWidth + margin.left + margin.right)
		.attr("height", chartHeight + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.right + ")");
	
	chartColors = d3.scale.category10();
	
	// create y function to scale values for y-axis
	y = d3.scale.linear()
		.range([chartHeight, 100])
		.domain([0, 70]);

	// create x function to scale ordinal values, because x-values are month names
	x = d3.scale.ordinal()
		.rangeRoundBands([0, chartWidth - 300], 0.05)
		.domain(currentData.map(function(d) { return d.Misdrijf}));

	// create x-axis based on scale and oriented at the bottom
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.tickFormat(function(d) {return d + "%"});

	// append x-axis to the chart
	chartSvg.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + chartHeight + ")")
		.call(xAxis)
		.selectAll("text").remove()

	// append text label to x-axis
	chartSvg.append("text")
		.attr("class", "label")
		.attr("x", (chartWidth - 300) / 2)
		.attr("y", height - margin.bottom / 1.5) // HIER MISSCHIEN NOG AANPASSEN
		.style("text-anchor", "middle")
		.style("font-size", 15)
		.text("Soort Misdrijf")

	// append y-axis with text label to chart
	chartSvg.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.append("text")
		.attr("class", "label")
		.attr("transform", "rotate(-90)")
		.attr("x", -100)
		.attr("y", - margin.left / 1.2)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Percentage van totaal");

	// calculate barwidth, based on width and amount of bars 
	var barWidth = chartWidth / currentData.length

	var chartTip = d3.tip()
		.attr("id", "chartTip")
		.attr("class", "tip")
		.offset([-10, 0])
		.html(function(d) {
			return "<text>"+ d.Misdrijf +": " + d.GeregistreerdeMisdrijvenRelatief_2 + "%</text>";
		})

	chartSvg.call(chartTip)

	chartSvg.selectAll("#legendaColors")
		.data(currentData)
		.enter().append("rect")
		.attr("id", "legendaColors")
		.attr("class", "legenda")
		.attr("x", 575)
		.attr("y", function(d, i) {return 100 + 25 * i})
		.attr("width", 20)
		.attr("height", 20)
		.style("fill", function(d) {return chartColors(d.Misdrijf)})

	chartSvg.selectAll("#legendaText")
		.data(currentData)
		.enter().append("text")
		.attr("id", "legendaText")
		.attr("class", "legenda")
		.attr("x", 600)
		.attr("y", function(d, i) {return 112 + 25 * i})
		.attr("width", 50)
		.attr("height", 40)
		.text(function(d) {return d.Misdrijf})
		.attr("text-anchor", "start")

	chartSvg.append("text")
		.attr("id", "chartName")
		.attr("x", (chartWidth - 300) / 2)
		.attr("y", chartHeight / 3)
		.text(currentData[0].Provincie)

	// create bar (rect) for each datapoint with corresponding scaled height
	var bar = chartSvg.selectAll(".bar")
		.data(currentData).enter()
		.append("rect")
		.attr("class", function(d, i) {return "bar"})
		.attr("id", function(d) {return d.Misdrijf.replace(/ /g,'')})
		.attr("y", function(d) {return y(d.GeregistreerdeMisdrijvenRelatief_2); })
		.attr("x", function(d) {return x(d.Misdrijf)})
		.attr("height", function(d) {return chartHeight - y(d.GeregistreerdeMisdrijvenRelatief_2)})
		.attr("width", x.rangeBand())
		.style("fill", function(d) {return chartColors(d.Misdrijf)})
		.on("mouseover", function(d) {
			chartTip.show(d)
			d3.select(this).style("opacity", 0.7)
		})
		.on("mouseout", function(d) {
			chartTip.hide(d, i)
			d3.select(this).style("opacity", 1)
		});
}

function clickEvent(location) {
	if (location == "Groningen") {
		currentData = provinces[0];
	}
	else if (location == "Friesland"){
		currentData = provinces[1];
	}
	else if (location == "Drenthe"){
		currentData = provinces[2];
	}
	else if (location == "Overijssel"){
		currentData = provinces[3];
	}
	else if (location == "Flevoland"){
		currentData = provinces[4];
	}
	else if (location == "Gelderland"){
		currentData = provinces[5];
	}
	else if (location == "Utrecht"){
		currentData = provinces[6];
	}
	else if (location == "Noord-Holland") {
		currentData = provinces[7];
	}
	else if (location == "Zuid-Holland") {
		currentData = provinces[8];
	}
	else if (location == "Noord-Brabant") {
		currentData = provinces[9];
	}
	else if (location == "Limburg"){
		currentData = provinces[10];
	}
	else {
		currentData = provinces[11];
	};

	console.log(currentData)

	var bars = chartSvg.selectAll(".bar")
		.data(currentData)

	// bars.exit().remove()
	// bars.enter().append("rect")

	bars.transition()
		.duration(750)
		.attr("y", function(d) {return y(d.GeregistreerdeMisdrijvenRelatief_2); })
		.attr("height", function(d) {return chartHeight - y(d.GeregistreerdeMisdrijvenRelatief_2)})

	chartSvg.select("#chartName")
		.text(currentData[0].Provincie)
} 






