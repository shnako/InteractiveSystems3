// main d3.js chart generator function:
var scatter = function () {
    var categories = [];

    d3.csv("js/AllOccupations.csv", function (data) {

        var margin = {top: 0, right: 0, bottom: 50, left: 60},
            width = 1050 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var xMax = d3.max(data, function (d) {
                return +d.TotalEmployed2011;
            }) * 1.05,
            xMin = 0,
            yMax = d3.max(data, function (d) {
                return +d.MedianSalary2011;
            }) * 1.05,
            yMin = 0;


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
            return d.TotalEmployed2011;
        }));
        var yMed = median(_.map(data, function (d) {
            return d.MedianSalary2011;
        }));


        var svg = d3.select("#chart").append("svg")
            .attr("id", "scatter")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 13]).on("zoom", zoom));


        var tooltip = d3.select("#tooltip");
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

        //Create median boxes:
        objects.append("rect")
            .attr("class", "tlMed med")
            .attr("width", x(xMed))
            .attr("height", y(yMed))
            .on("mouseover", function () {
                //Update the quadrant description:
                quadrant.select("h5").text("Elite Players");
                quadrant.select("p").text("Occupations in this quadrant pay the most, but employ very few: Competition can be tough.");
                quadrant.classed("hidden", false);
            })
            .on("mouseout", function () {
                //Update the quadrant description:
                quadrant.classed("hidden", true);
                quadrant.select("h5").text("");
                quadrant.select("p").text("");
            });
        objects.append("rect")
            .attr("class", "trMed med")
            .attr("width", width - x(xMed))
            .attr("height", y(yMed))
            .attr("transform", "translate(" + (x(xMed)) + ",0)")
            .on("mouseover", function () {
                //Update the quadrant description:
                quadrant.select("h5").text("Top Performers");
                quadrant.select("p").text("Occupations in this quadrant employ lots of people and offer above-average salaries: Seriously worth considering.");
                quadrant.classed("hidden", false);
            })
            .on("mouseout", function () {
                //Update the quadrant description:
                quadrant.classed("hidden", true);
                quadrant.select("h5").text("");
                quadrant.select("p").text("");
            });
        objects.append("rect")
            .attr("class", "brMed med")
            .attr("width", width - x(xMed))
            .attr("height", height - y(yMed))
            .attr("transform", "translate(" + (x(xMed)) + "," + (y(yMed)) + ")")
            .on("mouseover", function () {
                //Update the quadrant description:
                quadrant.select("h5").text("A Good Bet");
                quadrant.select("p").text("Occupations in this category may not pay the most, but there are lots of opportunities.");
                quadrant.classed("hidden", false);
            })
            .on("mouseout", function () {
                //Update the quadrant description:
                quadrant.classed("hidden", true);
                quadrant.select("h5").text("");
                quadrant.select("p").text("");
            });
        objects.append("rect")
            .attr("class", "blMed med")
            .attr("width", x(xMed))
            .attr("height", height - y(yMed))
            .attr("transform", "translate(0," + (y(yMed)) + ")")
            .on("mouseover", function () {
                //Update the quadrant description:
                quadrant.select("h5").text("A Matter of Taste");
                quadrant.select("p").html("Occupations in this quadrant may not pay the most or employ the most people, but if it&rsquo;s your passion then go for it!");
                quadrant.classed("hidden", false);
            })
            .on("mouseout", function () {
                //Update the quadrant description:
                quadrant.classed("hidden", true);
                quadrant.select("h5").text("");
                quadrant.select("p").text("");
            });


        //Create hexagon points
        objects.selectAll("polygon")
            .data(data)
            .enter()
            .append("polygon")
            .attr("class", function (d) {
                return colourScale(d.ProjectedGrowth2020, classes);
            })
            .attr("transform", function (d) {
                return "translate(" + x(d.TotalEmployed2011) + "," + y(d.MedianSalary2011) + ")";
            })
            .attr('points', '4.569,2.637 0,5.276 -4.569,2.637 -4.569,-2.637 0,-5.276 4.569,-2.637')
            .attr("opacity", "0.8")
            .on("mouseover", function (d) {
                //Update the tooltip value
                tooltip.select("#name").text(d.OccupationTitle);
                tooltip.select("#desc").text(d.Category);
                tooltip.select("#totEmp").text(numberWithCommas(d.TotalEmployed2011));
                tooltip.select("#medSal").text("$" + numberWithCommas(d.MedianSalary2011));
                tooltip.select("#projGrowth").text(d.ProjectedGrowth2020 + '%');
                tooltip.select("#education").text(d.Education);
                tooltip.select("#experience").text(d.Experience);

                // Determine whether polygon is in left/right side of screen, and alter tooltip location accordingly:
                if ($(this).attr("transform").substr(10, 10) * 1 > width / 2) tooltip.classed("leftPos", true);
                else tooltip.classed("leftPos", false);

                //Show the tooltip
                if (($(this).attr('class') != 'inactive'))
                    tooltip.classed("hidden", false);

            })
            .on("mouseout", function () {
                //Hide the tooltip
                tooltip.classed("hidden", true);
            });


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
                    return "translate(" + x(d.TotalEmployed2011) + "," + y(d.MedianSalary2011) + ")";
                });
        };

        // Filter function: Sets polygons in some categories to inactive using the category selecter:
        function filter() {
            svg.selectAll("polygon")
                .attr("class", function (d) {
                    if (categories.length > 0 && !_.contains(categories, d.Category)) {
                        $.each(categories, function (i) {
                            $('#navToggle span').append(categories[i] + ' ');
                        });
                        return "inactive";
                    } else {
                        return colourScale(d.ProjectedGrowth2020, classes);
                    }
                });
        };

        // jQuery Nav List events:
        (function () {
            // cache jQuery element calls:
            var nt = $('#navToggle'),
                nla = $('.nl a'),
                rn = $('#resetNav');

            // Show/hide nav list when button is clicked:
            nt.off('click').on('click', function (e) {
                e.preventDefault();
                $(this).toggleClass('active');
                if ($(this).hasClass('active')) {
                    $(this).next('#navListContainer').slideDown();
                } else {
                    $(this).next('#navListContainer').slideUp();
                }
            });

            // Filter points by category:
            nla.off('click').on('click', function (e) {
                e.preventDefault();
                $(this).toggleClass('a');
                if ($(this).hasClass('a')) {
                    categories.push($(this).text());
                } else {
                    categories = _.without(categories, $(this).text());
                }
                filter();
                if (categories.length > 0) {
                    var cats = '',
                        showedNames = 0;
                    $.each(categories, function (i) {
                        //var added = cats += categories[i]+'; ';
                        if ((cats + categories[i] + '; ').length < 130) {
                            var gap = (categories.length > 1 && i < categories.length - 1) ? '; ' : '';
                            showedNames++;
                            cats += categories[i] + gap;
                        } else {
                            return false;
                        }
                    });
                    if ((categories.length - showedNames) > 1)
                        cats = cats.substring(0, cats.length - 2) + ' + ' + (categories.length - showedNames) + ' other categories';
                    else if ((categories.length - showedNames) > 0)
                        cats = cats.substring(0, cats.length - 2) + ' + 1 other category';
                    nt.addClass('showCats').find('span').html(cats);
                } else {
                    nt.removeClass('showCats').find('span').html('Select the categories you are interested in:');
                }
                ;
            });

            // Reset categories:
            rn.off('click').on('click', function (e) {
                e.preventDefault();
                nla.removeClass('a');
                nt.removeClass('showCats').find('span').html('Select the categories you are interested in:');
                categories = [];
                filter();
            });

            // Reset categories AND close categories menu:
            $('#doneNav').off('click').on('click', function (e) {
                e.preventDefault();
                nla.removeClass('a');
                nt.removeClass('active showCats').find('span').html('Select the categories you are interested in:');
                categories = [];
                filter();
                $('#navListContainer').slideUp();
            });

            //Annotations toggle button:
            $('#annotations').off('click').on('click', function (e) {
                e.preventDefault();
                var txt = $(this).hasClass('on') ? 'off' : 'on';
                $(this).toggleClass('on').find('span').text(txt);
                $('#chart, #quadrant').toggleClass('annotationsOn');
            });

        })();

        // Generate Nav List from data:
        //navListGen(data);


        // Testing a technique to add GMaps-style zoom buttons. Not working yet:
        /*
         function wheel(event) {
         //    console.log(event.detail)
         alert(event.detail);
         }

         var view;
         window.onload = function() {
         view = document.getElementById('view');
         view.addEventListener('DOMMouseScroll', wheel, false);
         }

         window.ChromeWheel  = function() {
         var evt = document.createEvent("MouseEvents");
         evt.initMouseEvent(
         'DOMMouseScroll', // in DOMString typeArg,
         true,  // in boolean canBubbleArg,
         true,  // in boolean cancelableArg,
         window,// in views::AbstractView viewArg,
         120,   // in long detailArg,
         0,     // in long screenXArg,
         0,     // in long screenYArg,
         0,     // in long clientXArg,
         0,     // in long clientYArg,
         0,     // in boolean ctrlKeyArg,
         0,     // in boolean altKeyArg,
         0,     // in boolean shiftKeyArg,
         0,     // in boolean metaKeyArg,
         0,     // in unsigned short buttonArg,
         null   // in EventTarget relatedTargetArg
         );
         view.dispatchEvent(evt);
         }

         $('#zoom a').on('click',function(e){
         e.preventDefault();
         zoom();
         //console.log(zoom);
         });
         //*/
    });
}

// Generate the list of categories. Only needs to be done once, then copy-paste the info from Firebug into index.html, because the static HTML copy loads faster and places less strain on the DOM than an auto-generated version.
/*
 function navListGen(data){
 var foo = _.uniq(data,function(d){
 return d.Category;
 }).map(function(d){
 return d.Category;
 }).sort();;
 var nl = '';
 _.each(foo,function(d,i){
 nl+= '<li class="nl"><a href="'+i+'">'+d+'</a></li>';
 });
 $('#navList').html(nl);
 };
 //*/

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