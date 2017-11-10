/**
* Name: Eline Rietdijk
* Studentnumber: 10811834
* Project: Line graph with Javascript
*
* "dataline.js"
* This file .......
**/

// initialize width and height of graph
var WIDTH = 700;
var HEIGHT = 500;
var AXIS_DISTANCE = 50;
var ANGLE = 45 * Math.PI / 180;
var ANGLE2 = 90 * Math.PI / 180;

// initialize empty arrays to store date and temp values
var temps = [];
var dates = [];

// initialize XMLHttpRequest function
var loadRawFile = new XMLHttpRequest();
loadRawFile.onreadystatechange = function() {

	// perform when loadRawFile is changed
    if (this.readyState == 4 && this.status == 200) {

       // perform when document is ready
       var data = loadRawFile.responseText;
       console.log(data);
       writeGraph(data);
    }
};

// open and send rawdata.txt using loadRawFile
loadRawFile.open("GET", "rawdata.txt", true);
loadRawFile.send();

function writeGraph(data) {
	for (var i = 1; i < 365; i++)
	{
		thisData = data.split("\n")[i];

		// split date and temp from data at ",", use trim to remove whitespace
		var date = thisData.split(",")[0].trim();
		var temp = thisData.split(",")[1].trim();

		// transform dates to numbers 1 through 265
		var dateString = date.slice(0,4) + "," + date.slice(4,6) + "," + date.slice(6,8)
		date = new Date(dateString);
		console.log(typeof date);
		console.log(date);
		date = (date.getTime() - 1388444400000) /  86400000;

		// add date and temp to corresponding strings
		dates[i - 1] = date;
		temps[i - 1] = temp;
	};

	// set domain for X
	var domainX = [];
	domainX[0] = 1;
	domainX[1] = 366;

	// set domain for Y
	var domainY = [];
	domainY[0] = Math.min.apply(null, temps);
	domainY[1] = Math.max.apply(null, temps);
	console.log(domainY)

	// set range for X
	var rangeX = [];
	rangeX[0] = AXIS_DISTANCE;
	rangeX[1] = WIDTH;

	// set range for Y
	var rangeY = [];
	rangeY[0] = HEIGHT - AXIS_DISTANCE;
	rangeY[1] = 0;

	// create transform functions for x and y coördinates
	var transformX = createTransform(domainX, rangeX);
	var transformY = createTransform(domainY, rangeY);

	// hieronder heb ik allemaal van de tutorial. Bronvermelding?
	// initialize 2D canvas element 
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext('2d');

	// move to the first data coördinate to start the graph
	ctx.beginPath();
	ctx.moveTo(transformX(dates[0]), transformY(temps[0]));

	// iterate over remaining coördinates
	for (var i = 1; i < dates.length; i++)
	{
		// write line to each coördinate to create graph
		ctx.lineTo(transformX(dates[i]), transformY(temps[i]));
	}

	// move to start of y-axis
	ctx.moveTo(AXIS_DISTANCE, 0);

	// write y-axis
	ctx.lineTo(AXIS_DISTANCE, HEIGHT - AXIS_DISTANCE);

	// write x-axis 
	ctx.lineTo(WIDTH, HEIGHT - AXIS_DISTANCE);

	// create array containing day numbers that indicate start of new month
	startMonth = [1, 32, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

	// create array containing names of all months 
	nameMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	// iretate over days that indicate start of new month
	for (var i = 0; i < startMonth.length; i++)
	{
		// add a small line at the x-axis to indicate each new month
		ctx.moveTo(transformX(startMonth[i]), HEIGHT - AXIS_DISTANCE);
		ctx.lineTo(transformX(startMonth[i]), HEIGHT - AXIS_DISTANCE + 5);

		// rotate canvas in order to print sloping text
		ctx.rotate(ANGLE);

		// calculate coördinates after rotation using sinus and cosinus
		var newY = (HEIGHT - (AXIS_DISTANCE / 1.3)) * Math.cos(ANGLE) - transformX(startMonth[i]) * Math.sin(ANGLE)
		var newX = (HEIGHT - (AXIS_DISTANCE / 1.3)) * Math.sin(ANGLE) + transformX(startMonth[i]) * Math.cos(ANGLE)
		ctx.fillText(nameMonth[i], newX, newY);

		// rotate back to default
		ctx.rotate(- ANGLE);
	}

	for (var i = 50; i < 350; i+=50)
	{
		// add a small line at the y-axis to indicate degrees
		ctx.moveTo(AXIS_DISTANCE, transformY(i));
		ctx.lineTo(AXIS_DISTANCE - 5, transformY(i));

		// add amount of degrees to indicator
		ctx.strokeText(i/10, AXIS_DISTANCE / 2, transformY(i));
	}

	// rotate 90 degrees to add y-axis label
	ctx.rotate(-ANGLE2);

	// enlarge text font
	ctx.font = '15px serif';

	// calculate coördinates after rotation using sinus and cosinus
	var newY = (HEIGHT - AXIS_DISTANCE) * Math.cos(-ANGLE2) - (AXIS_DISTANCE / 3.5) * Math.sin(-ANGLE2)
	var newX = (HEIGHT - AXIS_DISTANCE) * Math.sin(-ANGLE2) + (AXIS_DISTANCE / 3.5) * Math.cos(-ANGLE2)

	// add y-axis label
	ctx.fillText("Temperature in degrees Celcius -->", newX, newY);

	// rotate back to default
	ctx.rotate(ANGLE2);

	// add x-axis label
	ctx.fillText("Months -->", AXIS_DISTANCE, HEIGHT + (AXIS_DISTANCE / 6));


	ctx.stroke();
}

function createTransform(domain, range){
	// domain is a two-element array of the data bounds [domain_min, domain_max]
	// range is a two-element array of the screen bounds [range_min, range_max]
	// this gives you two equations to solve:
	// range_min = alpha * domain_min + beta
	// range_max = alpha * domain_max + beta
 		// a solution would be:

    var domain_min = domain[0]
    var domain_max = domain[1]
    var range_min = range[0]
    var range_max = range[1]

    // formulas to calculate the alpha and the beta
   	var alpha = (range_max - range_min) / (domain_max - domain_min)
    var beta = range_max - alpha * domain_max

    // returns the function for the linear transformation (y= a * x + b)
    return function(x){
      return alpha * x + beta;
    }
}

		