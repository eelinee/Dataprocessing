/* 
Name: Eline Rietdijk
Studentnumber: 10811834
*/

window.onload = function() {
	
	// load datasets using a queue 
	d3.queue()
	.defer(d3.csv, "nederland_criminaliteit_totaal.csv")
	.defer(d3.csv, "nederland_soorten_misdrijven.csv")
	.await(create_map)
}



function create_map(error, criminaliteit_totaal, criminaliteit_soort) {

	console.log(criminaliteit_soort)
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

	var provincies = [Groningen, Friesland, Drenthe, Overijssel, Flevoland, Gelderland, 
		Utrecht, NoordHolland, ZuidHolland, NoordBrabant, Limburg, Zeeland]

	for (i = 0; i < provincies.length; i ++) {
		for(j = 0; j < criminaliteit_soort.length; j ++) {
			if (provincies[i][0] == criminaliteit_soort[j].Provincie) {
				provincies[i].push(criminaliteit_soort[j])
			}
		}
		provincies[i].splice(0, 1)
	}

	console.log(provincies)

	// set margins for whitespace on sides of the graph
	var margin = {top: 20, right: 150, bottom: 50, left: 50},

		// set width and height of the graph, including margins
		width = 1100
		height = 1270


	// select svg element and create svg with appriopriate width and height
	var svg_map = d3.select(".map")
		.attr("width", width)
		.attr("height", height / 2);

	var path = d3.geo.path()
		.projection(projection);

	var g = svg_map.append("g")

	var projection = d3.geo.mercator()
		.scale(1)
		.translate([0, 0]);

	var path = d3.geo.path()
		.projection(projection)

	var map_tip = d3.tip()
		.attr("class", "map-tip")
		.offset([-10, 0])
		.html(function(d, i) {
			return "<text style = 'color:whitesmoke'>"+ value.RegioS +":" + value.GeregistreerdeMisdrijvenPer1000Inw_3 + " Misdrijven per 1000 inwoners</text>";
		})

	svg_map.call(map_tip)

	var colors = d3.scale.quantize()
		.domain([40, 45, 50, 55, 60, 65, 75])
		.range(["#ffe6e6", "#ffb3b3", "#ff8080", 
			"#ff6666", "#ff1a1a", "#ff0000", "#cc0000"])


	d3.json("netherlands.json", function(error, nld) {
		g.selectAll("path")
			var l = topojson.feature(nld, nld.objects.subunits).features[3],
				b = path.bounds(l),
				s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / (height / 2)),
				t = [(width - s * (b[1][0] + b[0][0])) / 2, ((height / 2) - s * (b[1][1] + b[0][1])) / 2];
			
			projection
				.scale(s)
				.translate(t)

			svg_map.selectAll("path")
				.data(topojson.feature(nld, nld.objects.subunits).features).enter()
				.append("path")
				.attr("d", path)
				.attr("stroke", "black")
				.attr("class", function(d, i) {
					return d.properties.name;
				})
				.attr("fill", function(d, i) {
					if (d.properties.name != null) {
						for (var j = 0; j < criminaliteit_totaal.length; j ++) {
							if (criminaliteit_totaal[j].RegioS == d.properties.name) {
								value = criminaliteit_totaal[j]
							}
						}
						return colors(value.GeregistreerdeMisdrijvenPer1000Inw_3);
					}
					else {
						return "grey"
					}
				})
				.on("mouseover", function(d, i) {
					for (var j = 0; j < criminaliteit_totaal.length; j ++) {
							if (criminaliteit_totaal[j].RegioS == d.properties.name) {
								value = criminaliteit_totaal[j]
							}
						}
					map_tip.show(value, i)
					d3.select(this).style("opacity", 0.5)
				})
				.on("mouseout", function(d, i) {
					map_tip.hide(d, i)
					d3.select(this).style("opacity", 1)
				})
				.on("click", function(d, i) {
					click_event(d, i)
				})
	});

	var chart_width = width / 2
	var chart_height = height / 3
	
	var svg_chart = d3.select(".chart")
		.attr("width", chart_width + 20)
		.attr("height", chart_height)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.right + ")")

	// create y function to scale values for y-axis
	var y = d3.scale.linear()
		.range([chart_height, 0])
		.domain([0, 91400]);

	// create x function to scale ordinal values, because x-values are month names
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, chart_width - margin.left - margin.right], 0.05)
		.domain(provincies[0].map(function(d) { return d.Misdrijf}))

	// calculate barwidth, based on width and amount of bars (mean.length)
	var barWidth = chart_width - margin.left - margin.right / 8

	var chart_tip = d3.tip()
		.attr("class", "chart-tip")
		.offset([-10, 0])
		.html(function(d, i) {
			return "<text style = 'color:black'>"+ d.Misdrijf +":" + d.TotaalGeregistreerdeMisdrijven_1 + "</text>";
		})

	svg_chart.call(chart_tip)

	// create bar (rect) for each datapoint with corresponding scaled height
	var bar = svg_chart.selectAll(".rect")
		.data(provincies[8]).enter()
		.append("rect")
		.attr("class", "rect")
		.attr("y", function(d) {console.log(d.TotaalGeregistreerdeMisdrijven_1); return y(d.TotaalGeregistreerdeMisdrijven_1); })
		.attr("x", function(d) {return x(d.Misdrijf)})
		.attr("height", function(d) {return chart_height - y(d.TotaalGeregistreerdeMisdrijven_1); })
		.attr("width", x.rangeBand())
		.style("fill", "red")
		.on("mouseover", function(d, i) {
			chart_tip.show(d, i)
			d3.select(this).style("opacity", 0.4)
		})
		.on("mouseout", function(d, i) {
			chart_tip.hide(d, i)
			d3.select(this).style("opacity", 1)
		});


	// create x-axis based on scale and oriented at the bottom
	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	// append x-axis to the chart
	svg_chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + chart_height + ")")
		.call(xAxis)
		.append("text")
		.attr("x", chart_width)
		.attr("y", .75 * margin.bottom)
		.style("text-anchor", "end")
		.text("Soort Misdrijf");

	// append text labels as legenda
	svg_chart.append("g")
		.attr("class", "y axis")
		.attr("transform", "translate(" + 0 + ", 0)")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", - margin.left)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text("Aantal Misdrijven");
}


