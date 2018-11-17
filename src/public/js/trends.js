$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        // alert("Please login first");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        // alert("Please login first");
        return;
    }

    console.log("in trends");

    // get the months and add them to the dropdown
    /*
    months = [];
    $.ajax({
        type: 'GET',
        url: '/generate/months',
        data: {},
        success: function(response) {
            // get the type of account they are (teq or org)
            // setup local storage
            console.log("success - months:");
            for (var template in response) {
                // we might have many months
                for (var eachMonth in response[template]) {
                    console.log("inner");
                    var result = response[template][eachMonth];
                    // only add if its not already inside
                    if (months.indexOf(result) < 0) {
                        console.log(result + " not in mon");
                        months.push(result);
                        $("#monthID").append($('<option></option>').val(result).html(result));
                        console.log(months);
                    }

                }
            }
            //console.log(months);

            // add it to dropdown
            
        },
        error: function(response) {
            console.log("something not right.");
        }
    });
    */


    var tableJSON;
var pieChart = null;

    $("#generate-btn").click(function() {
        var e = document.getElementById("ddlViewBy");
        var option = e.options[e.selectedIndex].value;
        // var f = document.getElementById("monthID");
        // var option2 = f.options[f.selectedIndex].value;

        var data = {template: option};
        $.ajax({
            type: 'POST',
            url: '/generate-trends',
            data: data,
            success: function(response) {
                // get the type of account they are (teq or org)
                // setup local storage
                console.log("success");
                console.log(response);
                localStorage.setItem("trendsJSON", JSON.stringify(response));
                localStorage.setItem("tableHeader", option);
                window.location.replace("/trends-graph");
                // updateChart();

                // reroute them based on the location data provides
            },
            error: function(response) {
                console.log("something not right.");
            }
        });
    });

});