$(document).ready(function () {

    window.regions = {
        "Europe": ["Albania", "Andorra", "Armenia", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom"],
        "Asia": ["Afghanistan", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Timor-Leste", "Egypt", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Maldives", "Mongolia", "Nepal", "North Korea", "Oman", "Pakistan", "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"],
        "Africa": ["Algeria", "Angola", "Bahrain", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros", "Republic of the Congo", "Democratic Republic of Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Mauritius", "Malawi", "Mali", "Mauritania", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Paraguay", "Rwanda", "Sao Tome and Principe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Uruguay", "Zambia", "Zimbabwe"],
        "North America": ["Canada", "Mexico", "United States of America"],
        "Central America": ["Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"],
        "South America": ["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Peru", "Suriname", "Trinidad and Tobago", "Venezuela"],
        "Oceania": ["Oceania", "Australia", "Cook Islands", "Fiji", "Indonesia", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"],
        "Carribean": ["Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Bermuda", "Cuba", "Dominica", "Dominican Republic", "Grenada", "Haiti", "Jamaica", "Puerto Rico", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines"]
    };

    // Refresh scatterplot and populate data
    $(".axes").on("change", function () {
        $('#chart').empty();
        $("#x_min_value").val("");
        $("#x_max_value").val("");
        $("#y_min_value").val("");
        $("#y_max_value").val("");
        scatter();
    });

    // Set up tooltip
    $( document ).tooltip({show : {delay: 1000}});

    // Refresh the scatterplot after the country/region filter has been applied
    $("#country").on("change", function () {
        $('#chart').empty();
        scatter();
    });
    $("#region").on("change", function () {
        $('#chart').empty();
        scatter();
    });

    // Refresh the scatterplot after the country filter has been applied
    $(".range-value").on("change", function () {
        $('#chart').empty();
        scatter();
    });

    // Set up range sliders for X and Y axis
    // TODO: Dynamically get "min" and "max" values
    $(".slider-range-x").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 500 ],
        slide: function (event, ui) {
            $('#chart').empty();
            $("#x_min_value").val(ui.values[0]);
            $("#x_max_value").val(ui.values[1]);
            scatter();
        }
    });

    // Dynamically get "min" and "max" values
    $(".slider-range-y").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 500 ],
        slide: function (event, ui) {
            $('#chart').empty();
            $("#y_min_value").val(ui.values[0]);
            $("#y_max_value").val(ui.values[1]);
            scatter();
        }
    });

    // Convert multiple select dropdown to dropdown checklist
    $("#region").select2();
    $("#country").select2();
    // Implement reset function
    $("#reset").click(function () {
        $('#chart').empty();
        $(".range-value").val("");
        $("#region option:selected").removeAttr("selected");
        $("#region").select2();
        $("#country option:selected").removeAttr("selected");
        $("#country").select2();
        scatter();
    });

    $("#clear_all").click(function() {
        $("#region option:selected").removeAttr("selected");
        $("#region").select2();
        $("#country option:selected").removeAttr("selected");
        $("#country").select2();
    });

    $("#select_all").click(function() {
        $("#region option").prop("selected", "selected");
        $("#region").select2();
        $("#country option").prop("selected", "selected");
        $("#country").select2();
    });

    $("#correlation").click(function() {
        var x = [];
        var y = [];

    });

    $.get("js/WHO data.csv", function (data) {
        // Populate dimension dropdowns
        var lines = data.split("\n");
        var headings = lines[0].split(",").sort();
        for (i in headings)
            $(".axes").append("<option value=\"" + headings[i] + "\">" + headings[i] + "</option>");

        for (var i = 1; i < lines.length; i++) {
            cols = lines[i].split(",");
            country = cols[2];
            $("#country").append(
                $("<option></option>")
                    .attr("value", country)
                    .text(country)
            );
        }
    });

    $("#region").on("change", function () {
        var selectedRegions = $(this).val();
        for (index in selectedRegions) {
            for (current in regions) {
                if (current == selectedRegions[index]) {
                    for (country in regions[current]) {
                        $("#country").append(
                            $("<option></option>")
                                .attr("value", regions[current][country])
                                .attr("selected", "selected")
                                .text(regions[current][country])
                        );
                    }
                }
            }
        }
        $("#country").select2();
    });


    $("#country").select2().on("select2-removed", function (e) {
        e.preventDefault();
        var countryRemoved = e.val;
        var toDelete = getRegion(countryRemoved);
        var selectedRegions = $("#region").select2("val");
        var newRegions = [];

        for (i in selectedRegions) {
            if (selectedRegions[i] != toDelete)
                newRegions.push(selectedRegions[i]);
        }

        $("#region").select2("val", newRegions);

    });

});

function getRegion(countryname) {
    for (region in regions) {
        for (i in regions[region]) {
            if (regions[region][i] == countryname)
                return region;
        }
    }
}

// main d3.js chart generator function:
var scatter = function () {

    d3.csv("js/WHO data.csv", function (data) {

        // For calculating correlation
        var n = 0;
        var sumx = 0;
        var sumy = 0;
        var sumxy = 0;
        var sumx2 = 0;
        var sumy2 = 0;


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
            }),
            xMin = d3.min(data, function (d) {
                return +d[x_data];
            }),
            yMax = d3.max(data, function (d) {
                return +d[y_data];
            }),
            yMin = d3.min(data, function (d) {
                return +d[y_data];
            });

        // Update range slider's min and max values
        $(".slider-range-x").slider("option", "min", xMin);
        $(".slider-range-x").slider("option", "max", xMax);
        $(".slider-range-y").slider("option", "min", yMin);
        $(".slider-range-y").slider("option", "max", yMax);

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
            $(".slider-range-x").slider({ values: [ xMin, xMax ] });
            $(".slider-range-y").slider({ values: [ yMin, yMax ] });
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


        // Display the graph
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

        // Create hexagon points
        objects.selectAll("polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("transform", function (d) {
                return "translate(" + x(d[x_data]) + "," + y(d[y_data]) + ")";
            })
            .attr('points', '4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
            .attr("class", function (d) {
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
                    //console.log(x_coord + " " + y_coord)
                    n++;
                    sumx += x_coord;
                    sumy += y_coord;
                    sumx2 += x_coord*x_coord;
                    sumy2 += y_coord*y_coord;
                    sumxy += x_coord*y_coord;
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

        // Calculate and display correlation between X and Y (after filtering)
        var r = parseFloat((n*sumxy - sumx*sumy)/(Math.sqrt((n*sumx2 - Math.pow(sumx,2))*(n*sumy2 - Math.pow(sumy,2))))).toFixed(2);
        $("#correlation").text("Correlation: " + r);

        // Zoom/pan
        function zoom() {
            svg.select(".x.axis").call(xAxis);
            svg.select(".y.axis").call(yAxis);

            objects.select(".hAxisLine").attr("transform", "translate(0," + y(0) + ")");
            objects.select(".vAxisLine").attr("transform", "translate(" + x(0) + ",0)");

            svg.selectAll("polygon")
                .attr("transform", function (d) {
                    return "translate(" + x(d[x_data]) + "," + y(d[y_data]) + ")";
                });
        };

    });
}
