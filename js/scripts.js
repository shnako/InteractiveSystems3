$(document).ready(function() {
    // Set up default slider
    $( ".slider" ).slider({
        slide: function( event, ui ) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // Set up range sliders for X and Y axis
    // TODO: Dynamically get "min" and "max" values
     $( ".slider-range-x" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0,500 ],
        slide: function( event, ui ) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // TODO: Dynamically get "min" and "max" values
     $( ".slider-range-y" ).slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0,500 ],
        slide: function( event, ui ) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // TODO: Convert multiple select dropdown to dropdown checklist
    $("#region").select2();
    $("#country").select2();
    // TODO: implement reset function
    $( "#reset").click(function() {
        alert("yashi akasa");
    });

    // Load CSV contents
    var data = [
                  ["v1","v2","v3"],
                  ["v11","v22","v33"]
               ];

    for (var i = 0; i < data.length; i++) {
        var value = "<tr>";
        for (var j = 0; j <= data.length; j++)
            value += "<td>" + data[i][j] + "</td>";
        value += "</tr>";
        $("#data-table tr:last").after(value);
    }



});