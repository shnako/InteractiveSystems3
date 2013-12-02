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

    // TODO: implement reset function
    $( "#reset").click(function() {
        // Implement me
    });
});