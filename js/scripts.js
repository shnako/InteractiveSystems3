$(document).ready(function () {
    // Set up default slider
    $(".slider").slider({
        slide: function (event, ui) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // Set up range sliders for X and Y axis
    // TODO: Dynamically get "min" and "max" values
    $(".slider-range-x").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 500 ],
        slide: function (event, ui) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // TODO: Dynamically get "min" and "max" values
    $(".slider-range-y").slider({
        range: true,
        min: 0,
        max: 500,
        values: [ 0, 500 ],
        slide: function (event, ui) {
            // TODO: Insert custom function that refreshes the scatterplot
        }
    });

    // TODO: Convert multiple select dropdown to dropdown checklist
    $("#region").select2();
    $("#country").select2();
    // TODO: implement reset function
    $("#reset").click(function () {
        alert("iesi acasa");
    });

    var regions = {
                    "Europe":["Albania", "Andorra", "Armenia", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria", "Croatia", "Cyprus", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Georgia", "Germany", "Greece", "Hungary", "Iceland", "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Macedonia", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia", "Slovenia", "Spain", "Sweden", "Switzerland", "Turkey", "Ukraine", "United Kingdom"],
                    "Asia":["Afghanistan", "Azerbaijan", "Bangladesh", "Bhutan", "Brunei", "Cambodia", "China", "Timor-Leste", "Egypt", "Georgia", "Hong Kong", "India", "Indonesia", "Iran", "Iraq", "Israel", "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia", "Mongolia", "Nepal", "North Korea", "Oman", "Pakistan", "Philippines", "Qatar", "Russia", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka", "Syria", "Taiwan", "Tajikistan", "Thailand", "Turkey", "Turkmenistan", "United Arab Emirates", "Uzbekistan", "Vietnam", "Yemen"],
                    "Africa":["Algeria", "Angola", "Bahrain", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cameroon", "Cape Verde", "Central African Republic", "Chad", "Comoros", "Republic of the Congo", "Democratic Republic of Congo", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea", "Guinea", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Paraguay", "Rwanda", "Sao Tome and Principe", "Senegal", "Sierra Leone", "Somalia", "South Africa", "Sudan", "Swaziland", "Tanzania", "Togo", "Tunisia", "Uganda", "Uruguay", "Zambia", "Zimbabwe"],
                    "North_America":["Canada", "Mexico", "United States of America"],
                    "Central_America":["Costa Rica", "El Salvador", "Guatemala", "Honduras", "Nicaragua", "Panama"],
                    "South_America":["Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Peru", "Suriname", "Trinidad and Tobago", "Venezuela"],
                    "Oceania":["Oceania", "Australia", "Cook Islands", "Indonesia", "Micronesia", "Nauru", "New Zealand", "Palau", "Papua New Guinea", "Samoa", "Solomon Islands", "Tuvalu", "Vanuatu"],
                    "Carribean":["Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Bermuda", "Cuba", "Dominica", "Dominican Republic", "Grenada", "Haiti", "Jamaica", "Puerto Rico", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines"]
    };

    for (var i = 0; i < data.length; i++) {
        var value = "<tr>";
        for (var j = 0; j <= data.length; j++) {
            value += "<td>" + data[i][j] + "</td>";
        }
        value += "</tr>";
        $("#data-table tbody").append(value);
    }

})
;