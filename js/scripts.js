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
