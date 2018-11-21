var chart = null;

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

    function populateOptions () {
        // add header optgroups
        for (header in trendsJSON[0]['data']) {
            $("#option-select").append($("<optgroup></optgroup>").attr('label', header).attr('id', header));
        }
    
        // add options to optgroups
        for (i in trendsJSON) {
            var data = trendsJSON[i]['data'];
            for (header in data) {
                for (option in data[header]['options']) {
                    var headerEl = $('[label="' + header + '"]');
                    if (!headerEl.find("option[value='" + option + "']").length) {
                        $("<option id='" + option + "'>").val(option).text(option).appendTo(headerEl);
                    }
                }
            }
        }
    }

    populateOptions();

    /*
    var pieChart = new Chart(ctx, {
        type: 'line',
        data: constructData(trendsJSON),
        options: options,
    });*/

    function constructOptions(id, optId) {
        var text = tableHeader + " - " + optId + " (" + id + ")"; 
        var options = {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                position: "top",
                text: text, // title of graph
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
        return options;
    }

    function constructData(labels, dataClients, dataServices) {
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

    function createGraph(labels, dataClients, dataServices, id, optId) {
        var ctx = document.getElementById("myChart");

        if (chart != null) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: constructData(labels, dataClients, dataServices),
            options: constructOptions(id, optId),
        });
    }

    function handleGraphConversion(optGroupJSON, id, optId) {
        var labels = [];
        var dataClients = [];
        var dataServices = [];
        for (var key in optGroupJSON) {
            
            if (typeof(optGroupJSON[key]) == "object") {
                labels.push(Object.keys(optGroupJSON[key])[0]); // x-axis of dates
                console.log(optGroupJSON[key]);
                for (var date in optGroupJSON[key]) {
                    for (var clientService in optGroupJSON[key][date]["options"]) {
                        dataClients.push(optGroupJSON[key][date]["options"][clientService]["clients"]);
                        dataServices.push(optGroupJSON[key][date]["options"][clientService]["services"]);
                        //console.log();
                    }
                    //dataClients.push(optGroupJSON[key][date]["options"]["clients"]);
                    //dataServices.push(optGroupJSON[key][date]["options"]["services"]);
                }
            }
            
        }
        console.log(labels);
        console.log(dataClients);
        console.log(dataServices);
        createGraph(labels, dataClients, dataServices, id, optId);
    }

    function parseOptionSelected(id, optId) {
        console.log("in the func");
        var optGroupJSON = [];
        for (item in trendsJSON) {
            // loop over the data
            for (header in trendsJSON[item]["data"]) {
                if (header == optId) {
                    tempJSON = {};
                    // here we check if the option is actually inside the property
                    // if it doesn't we set client/services to 0 for this date
                    if(trendsJSON[item]["data"][header]["options"].hasOwnProperty(id)) {
                        tempJSON[trendsJSON[item]["month"]] = trendsJSON[item]["data"][header];
                    } else {
                        console.log("does not have property .. adding it");
                        emptyTotal = {"clients": 0, "services": 0};
                        innerJSON = {};
                        innerJSON[id] = emptyTotal;
                        outerJSON = {};
                        outerJSON["options"] = innerJSON;
                        tempJSON[trendsJSON[item]["month"]] = outerJSON;
                    }
                    // tempJSON = {};
                    //tempJSON[trendsJSON[item]["month"]] = trendsJSON[item]["data"][header];
                    console.log(JSON.stringify(tempJSON));
                    optGroupJSON.push(tempJSON, id);
                }
            }
            //$("#option-select").append($("<optgroup></optgroup>").attr('label', header).attr('id', header));
          
        }
        /*
                [
        {
        "2018-2": {
            "options": {
                "FRENCH": {
                "clients": 0,
                "services": 0
                }
            }
            }
        },
        {
        "2018-11": {
            "options": {
                "ENGLISH": {
                "clients": 1,
                "services": 1
                },
                "FRENCH": {
                "clients": 1,
                "services": 1
                }
            },
            "total": {
                "clients": 2,
                "services": 2
            }
            }
        }
        ]
        */

        handleGraphConversion(optGroupJSON, id, optId);
    }

    $('#option-select').change(function() {
        $('#option-select').find('option:selected').parent().attr('id')
        var id = $('#option-select').find('option:selected').attr('id');
        var optId = $('#option-select').find('option:selected').parent().attr('id');
        console.log(id + " --> " + optId);
        if (id != "select-option") {
            parseOptionSelected(id, optId);
        }
        $('#option-select option[id="select-option"]').attr('disabled','disabled');

    });
});