// main d3.js chart generator function:
var scatter = function () {
    var categories = [];

    d3.csv("js/WHO data.csv", function (data) {

        var margin = {top: 20, right: 30, bottom: 40, left: 45},
            width = 850 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var xMax = d3.max(data, function (d) {
                return +d.Gold;
            }) * 1.05,
            xMin = d3.min(data, function (d) {
                return +d.Gold;
            }) * 1.05,
            yMax = d3.max(data, function (d) {
                return +d.Silver;
            }) * 1.05,
            yMin = d3.min(data, function (d) {
                return +d.Silver;
            }) * 1.05;


        //Define scales
        var x = d3.scale.linear()
            .domain([xMin, xMax])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([yMin, yMax])
            .range([height, 0]);

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


        var svg = d3.select("#chart").append("svg")
            .attr("id", "scatter")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 13]).on("zoom", zoom));

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


        //Create hexagon points
        objects.selectAll("polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("class", "##1abc9c")
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

        // Zoom/pan behaviour:
        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            objects.select(".hAxisLine").attr("transform", "translate(0," + y(0) + ")");
            objects.select(".vAxisLine").attr("transform", "translate(" + x(0) + ",0)");

            svg.selectAll("polygon")
                .attr("transform", function (d) {
                    return "translate(" + x(d.Gold) + "," + y(d.Silver) + ")";
                });
        };

    });
}
