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

    var trendsJSON = localStorage.getItem('trendsJSON');
    var tableHeader = localStorage.tableHeader;
    trendsJSON = JSON.parse(trendsJSON);

    var ctx = document.getElementById("myChart");

    function constructData(data) {
        var labels = [];
        var dataClients = [];
        var dataServices = [];
        for (var key in data) {
            console.log(key);
            labels.push(data[key]["month"]); // x axis
            dataClients.push(data[key]["clients"]); // clients
            dataServices.push(data[key]["services"]); // services
        }
        var data = {
            labels: labels, // x axis = dates
            datasets: [
                {
                    label: "Clients", // clients
                    data: dataClients, // values
                    backgroundColor: "blue", borderColor: "lightblue", fill: false, lineTension: 0, radius: 5
                },
                {
                    label: "Services", // services
                    data: dataServices, // values
                    backgroundColor: "red", borderColor: "pink", fill: false, lineTension: 0, radius: 5
                }
            ]
            
        };

        return data;
    }

        var options = {
        responsive: true,
        maintainAspectRatio: false,
        title: {
            display: true,
            position: "top",
            text: tableHeader, // title of graph
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
        },
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    callback: function (value) { if (Number.isInteger(value)) { return value; } },
                    stepSize: 1
                }
            }]
        }
    };

    var pieChart = new Chart(ctx, {
        type: 'line',
        data: constructData(trendsJSON),
        options: options,
    });







});