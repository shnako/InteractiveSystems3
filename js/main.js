// main d3.js chart generator function:
var scatter = function () {
    var categories = [];

    d3.csv("js/WHO data.csv", function (data) {

        var margin = {top: 20, right: 30, bottom: 40, left: 45},
            width = 855 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var xMax = d3.max(data, function (d) {
                return +d.Gold;
            }) * 1.05,
            xMin = -45,
            yMax = d3.max(data, function (d) {
                return +d.Silver;
            }) * 1.05,
            yMin = -45;


        //Define scales
        var x = d3.scale.linear()
            .domain([xMin, xMax])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([yMin, yMax])
            .range([height, 0]);

        // Colour classes array:
        var classes = ['high', 'medium', 'low', 'negative'];
        // Use in conjunction with classes array:
        var colourScale = function (val, array, active) {
            if (val > 30) {
                return array[0];
            } else if (val > 10) {
                return array[1];
            } else if (val > 0) {
                return array[2];
            } else {
                return array[3];
            }
        };

        //Define X axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height)
            .tickFormat(d3.format("s"));

        //Define Y axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-width)
            .tickFormat(d3.format("s"));

        // Define medians. There must be a way to do this with d3.js but I can't figure it out.
        var xMed = median(_.map(data, function (d) {
            return d.Gold;
        }));
        var yMed = median(_.map(data, function (d) {
            return d.Silver;
        }));


        var svg = d3.select("#chart").append("svg")
            .attr("id", "scatter")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 13]).on("zoom", zoom));


        var quadrant = d3.select("#quadrant");

        // Create background
        svg.append("rect")
            .attr("width", width)
            .attr("height", height);

        //Create axes
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        var objects = svg.append("svg")
            .attr("class", "objects")
            .attr("width", width)
            .attr("height", height);

        //Create main 0,0 axis lines:
        objects.append("svg:line")
            .attr("class", "axisLine hAxisLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + (y(0)) + ")");
        objects.append("svg:line")
            .attr("class", "axisLine vAxisLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height);

        //Create median lines:
        objects.append("svg:line")
            .attr("class", "medianLine hMedianLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", width)
            .attr("y2", 0)
            .attr("transform", "translate(0," + (y(yMed)) + ")");
        objects.append("svg:line")
            .attr("class", "medianLine vMedianLine")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", 0)
            .attr("y2", height)
            .attr("transform", "translate(" + (x(xMed)) + ",0)");


        //Create hexagon points
        objects.selectAll("polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("class", function (d) {
                return colourScale(d.Gold, classes);
            })
            .attr("transform", function (d) {
                return "translate(" + x(d.Gold) + "," + y(d.Silver) + ")";
            })
            .attr('points', '4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
            .attr("opacity", "0.8");


        // Create X Axis label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.bottom - 10)
            .text("Total number of people employed in 2011");

        // Create Y Axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -margin.left)
            .attr("x", 0)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text("Median annual salary in 2011 ($)");

        //If val is negative, return zero:
        function noNeg(val) {
            return val = val > 0 ? val : 0;
        }

        // Zoom/pan behaviour:
        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            objects.select(".hAxisLine").attr("transform", "translate(0," + y(0) + ")");
            objects.select(".vAxisLine").attr("transform", "translate(" + x(0) + ",0)");

            objects.select(".hMedianLine").attr("transform", "translate(0," + y(yMed) + ")");
            objects.select(".vMedianLine").attr("transform", "translate(" + x(xMed) + ",0)");

            objects.select(".tlMed")
                .attr("width", noNeg(x(xMed)))
                .attr("height", noNeg(y(yMed)));
            objects.select(".trMed")
                .attr("width", noNeg(width - x(xMed)))
                .attr("height", noNeg(y(yMed)))
                .attr("transform", "translate(" + (x(xMed)) + ",0)");
            objects.select(".brMed")
                .attr("width", noNeg(width - x(xMed)))
                .attr("height", noNeg(height - y(yMed)))
                .attr("transform", "translate(" + (x(xMed)) + "," + (y(yMed)) + ")");
            objects.select(".blMed")
                .attr("width", noNeg(x(xMed)))
                .attr("height", noNeg(height - y(yMed)))
                .attr("transform", "translate(0," + (y(yMed)) + ")");

            svg.selectAll("polygon")
                .attr("transform", function (d) {
                    return "translate(" + x(d.Gold) + "," + y(d.Silver) + ")";
                });
        };

    });
}

// Get the median of an array.
function median(values) {
    values.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];
    else
        return (parseFloat(values[half - 1]) + parseFloat(values[half])) / 2.0;
};

//Add 'thousands' commas to numbers, for extra prettiness:
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}