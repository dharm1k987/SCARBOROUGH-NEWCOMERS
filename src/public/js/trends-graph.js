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

    console.log("in trend graph");


    var ctx = document.getElementById("myChart");

    var data = {
        labels: ["match1", "match2", "match3", "match4", "match5"], // x axis = dates
        datasets: [
            {
                label: "TeamA Score", // clients
                data: [10, 50, 25, 70, 40], // values
                backgroundColor: "blue",
                borderColor: "lightblue",
                fill: false,
                lineTension: 0,
                radius: 5
            },
            {
                label: "TeamB Score", // services
                data: [20, 35, 40, 60, 50], // values
                backgroundColor: "green",
                borderColor: "lightgreen",
                fill: false,
                lineTension: 0,
                radius: 5
            }
        ]
    };

    var options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            position: "top",
            text: "Line Graph", // title of graph
            fontSize: 18,
            fontColor: "#111"
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                fontColor: "#333",
                fontSize: 16
            }
        }
    };


    var pieChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });




});