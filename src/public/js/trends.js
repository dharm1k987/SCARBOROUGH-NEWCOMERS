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

function updateChart () {
    var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});
}




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