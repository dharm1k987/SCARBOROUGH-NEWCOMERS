var trendsJSON;

function populateOptions () {
    var ddEl = document.getElementById("option-select");
    
    for (header in trendsJSON[0]['data']) {
        $("#option-select").append($("<optgroup></optgroup>").attr('label', header).data('header', header));
    }

    for (i in trendsJSON) {
        var data = trendsJSON[i]['data'];
        for (header in data) {
            for (option in data[header]['options']) {
                var headerEl = $('[label="' + header + '"]');
                if (!headerEl.find("option[value='" + option + "']").length) {
                    $("<option>").val(option).text(option).appendTo(headerEl);
                }
            }
        }
    }
}

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

    trendsJSON = localStorage.getItem('trendsJSON');
    var tableHeader = localStorage.tableHeader;
    trendsJSON = JSON.parse(trendsJSON);

    populateOptions();
    var ctx = document.getElementById("myChart");

    function constructData(data) {
        // data = [{"month":"2018-2","clients":3,"services":1},{"month":"2018-3","clients":4,"services":2},{"month":"2018-5","clients":3,"services":2},{"month":"2018-5","clients":8,"services":8},{"month":"2018-6","clients":5,"services":3},{"month":"2018-7","clients":6,"services":5},{"month":"2018-8","clients":3,"services":3},{"month":"2018-9","clients":5,"services":5},{"month":"2018-10","clients":4,"services":3 },{"month":"2018-11","clients":2,"services":2}]
        var labels = [];
        var dataClients = [];
        var dataServices = [];
        for (var key in data) {
            console.log(key);
            labels.push(data[key]["month"]); // x axis
            dataClients.push(data[key]["clients"]); // clients
            dataServices.push(data[key]["services"]); // services
        }
        console.log(JSON.stringify(data));
        var data = {
            labels: labels, // x axis = dates
            datasets: [
                {
                    label: "Clients", // clients
                    data: dataClients, // values
                    "fill": false,
                    "borderColor": "rgb(75, 192, 192)",
                    "lineTension": 0
                    
                },
                {
                    label: "Services", // services
                    data: dataServices, // values
                    "fill": false,
                    "borderColor": "rgb(255, 2, 102)",
                    "lineTension": 0
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

    $('#option-select').change(function() {
        console.log('The option with value ' + $(this).val() + ' and text ' + $(this).text() + ' was selected.');
    });







});