// main d3.js chart generator function:
var scatter = function () {

    d3.csv("js/WHO data.csv", function (data) {
        
        // Select the datasets
        var x_data = $("#x_axis").val();
        var y_data = $("#y_axis").val();
        var countries = $("#country").val();

        // Set graph size
        var margin = {top: 20, right: 30, bottom: 40, left: 45},
            width = 850 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        // Find min and max values
        var xMax = d3.max(data, function (d) {  
                return +d[x_data];
            }) * 1.00,
            xMin = d3.min(data, function (d) {
                return +d[x_data];
            }) * 1.00,
            yMax = d3.max(data, function (d) {
                return +d[y_data];
            }) * 1.00,
            yMin = d3.min(data, function (d) {
                return +d[y_data];
            }) * 1.00;

        // Update range slider's min and max values        
        $( ".slider-range-x" ).slider("option", "min", xMin);
        $( ".slider-range-x" ).slider("option", "max", xMax);
        $( ".slider-range-y" ).slider("option", "min", yMin);
        $( ".slider-range-y" ).slider("option", "max", yMax);

        var x_lower_bound = $("#x_min_value").val();
        var x_upper_bound = $("#x_max_value").val();
        var y_lower_bound = $("#y_min_value").val();
        var y_upper_bound = $("#y_max_value").val();

        // Set min/max values if undefined (happens on load and a dimension change)
        if (x_lower_bound == "" || y_lower_bound == "") {            
            $("#x_min_value").val(xMin);
            $("#x_max_value").val(xMax);
            $("#y_min_value").val(yMin);
            $("#y_max_value").val(yMax);
            $( ".slider-range-x" ).slider({ values: [ xMin, xMax ] });
            $( ".slider-range-y" ).slider({ values: [ yMin, yMax ] });
        }

        // Adjust min and max values for scaling and other display purposes
        xMin = xMin * 1.05;
        xMax = xMax * 1.05;
        yMin = yMin * 1.05;
        yMax = yMax * 1.05;
            
        // Define scales
        var x = d3.scale.linear()
            .domain([xMin, xMax])
            .range([0, width]);

        var y = d3.scale.linear()
            .domain([yMin, yMax])
            .range([height, 0]);        

        // Define X axis
        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickSize(-height)
            .tickFormat(d3.format("s"));

        // Define Y axis
        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
            .tickSize(-width)
            .tickFormat(d3.format("s"));

        // Define medians
        var xMed = median(_.map(data, function (d) {
            return d[x_data];
        }));
        var yMed = median(_.map(data, function (d) {
            return d[y_data];
        }));


        // Display the graph
        var svg = d3.select("#chart").append("svg")
            .attr("id", "scatter")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 13]).on("zoom", zoom));    

        // Define quadrant
        var quadrant = d3.select("#quadrant");   

        // Create background
        svg.append("rect")
            .attr("width", width)
            .attr("height", height);            

        // Create axes
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

        // Create main 0,0 axis lines:
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

        // Create median lines:
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

        // Create hexagon points
        objects.selectAll("polygon")
            .data(data)
            .enter()
            .append("polygon")                  
            .attr("transform", function (d) {
                return "translate(" + x(d[x_data]) + "," + y(d[y_data]) + ")";                
            })
            .attr('points', '4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
            .attr("class", function(d) {
                // Check if country is in the list of selected countries
                var countryOk = false;
                if (countries == null)
                    countryOk = true;
                else
                  for (i in countries)
                    if (d.Country == countries[i])
                        countryOk = true;                    

                var x_coord = parseFloat(d[x_data]);
                var y_coord = parseFloat(d[y_data]);
                var min_x = $("#x_min_value").val();
                var max_x = $("#x_max_value").val();
                var min_y = $("#y_min_value").val();
                var max_y = $("#y_max_value").val();
                
                // Hide the dot if it does not fall into the range
                if (!countryOk || x_coord < min_x || x_coord > max_x || y_coord < min_y || y_coord > max_y || isNaN(x_coord) | isNaN(y_coord)) {                    
                    return "hidden dot";
                } else {            
                    return "dot";
                }
            });

        // Create X Axis label
        svg.append("text")
            .attr("class", "x label")
            .attr("text-anchor", "end")
            .attr("x", width)
            .attr("y", height + margin.bottom - 10)
            .text(x_data);

        // Create Y Axis label
        svg.append("text")
            .attr("class", "y label")
            .attr("text-anchor", "end")
            .attr("y", -margin.left)
            .attr("x", 0)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(y_data);

        // Zoom/pan 
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
                    return "translate(" + x(d[x_data]) + "," + y(d[y_data]) + ")";
                });
        };

    });
}

// If val is not positive, return zero:
function noNeg(val) {
            return val = val > 0 ? val : 0;
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
