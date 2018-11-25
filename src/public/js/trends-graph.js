$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    var chart = null;
    var trendsJSON = JSON.parse(localStorage.getItem('trendsJSON'));
    var tableHeader = localStorage.tableHeader;

    // populate dropdown options
    function populateOptions () {
        // add header optgroups
        for (header in trendsJSON[0]['data']) {
            $("#option-select").append($("<optgroup></optgroup>").attr('label', header).attr('id', header));
        }
    
        // add options to optgroups
        for (i in trendsJSON) {
            let data = trendsJSON[i]['data'];
            for (header in data) {
                for (var option in data[header]["options"]) {
                    let headerEl = $('[label="' + header + '"]');
                    if (!headerEl.find('option[value="' + option + '"]').length) {
                        $("<option id='" + option + "'>").val(option).text(option).appendTo(headerEl);
                    }
                }
            }
        }
    }

    // sort dropdown options
    function sortOptions() {
        // sort options
        $('optgroup').each(function () {
            $(this).html($(this).children().sort(function (a, b) {
                a = a.text;
                b = b.text;
                let aNum = parseInt(a, 10);
                let bNum = parseInt(b, 10);

                if (!isNaN(aNum) && !isNaN(bNum)) {
                    return aNum - bNum;
                } else if (a === 'YES' || b === 'YES') {
                    if (a === 'YES') return -1;
                    else if (b === 'YES') return 1;
                    else return 0;
                } else {
                    if (a < b) return -1;
                    if (a > b) return 1;
                    else return 0;
                }
            }));
        });
    }

    populateOptions();
    sortOptions();

    // construct the options that will go in the chart
    function constructChartOptions(id, optId) {
        let text = tableHeader + " - " + optId + " (" + id + ")"; 
        let options = {
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
                        stepSize: 5
                    }
                }]
            }
        };

        return options;
    }

    // construct the data that will go in the chart
    function constructChartData(labels, dataClients, dataServices) {
        let data = {
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

    // create the graph itself
    function createGraph(labels, dataClients, dataServices, id, optId) {
        var ctx = document.getElementById("myChart");

        if (chart != null) {
            chart.destroy();
        }

        chart = new Chart(ctx, {
            type: 'line',
            data: constructChartData(labels, dataClients, dataServices),
            options: constructChartOptions(id, optId),
        });
    }

    // special function that constructs data for the 'All' option, since it is done differently
    function constructDataAll() {
        // parse in special way
        let labels = [];
        let dataClients = [];
        let dataServices = [];
        
        for (var key in trendsJSON) {
            labels.push(trendsJSON[key]["month"]); // x axis
            dataClients.push(trendsJSON[key]["clients"]); // clients
            dataServices.push(trendsJSON[key]["services"]); // services
        }

        return [labels, dataClients, dataServices, "All", ""];
    }

    // by default, we want all data displayed
    allData = constructDataAll();
    createGraph(allData[0], allData[1], allData[2], allData[3], allData[4]);

    // if a user selects a option other then 'All'
    function parseOptionSelected(id, optId) {
        let optGroupJSON = [];

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
                        emptyTotal = {"clients": 0, "services": 0};
                        innerJSON = {}; innerJSON[id] = emptyTotal; 
                        outerJSON = {};  outerJSON["options"] = innerJSON;
                        tempJSON[trendsJSON[item]["month"]] = outerJSON;
                    }
                    optGroupJSON.push(tempJSON);
                }
            }
         
        }

        console.log(optGroupJSON);
        return optGroupJSON;
        
    }

    // convert the present graph to this new one
    function handleGraphConversion(optGroupJSON, id, optId) {
        let labels = [];
        let dataClients = [];
        let dataServices = [];

        // construct the optGroupJSON to a format we can understand
        for (var key in optGroupJSON) {
            if (typeof(optGroupJSON[key]) == "object") {
                labels.push(Object.keys(optGroupJSON[key])[0]); // x-axis of dates
                for (var date in optGroupJSON[key]) {
                    for (var clientService in optGroupJSON[key][date]["options"]) {
                        if (clientService == id) {
                            dataClients.push(optGroupJSON[key][date]["options"][id]["clients"]);
                            dataServices.push(optGroupJSON[key][date]["options"][id]["services"]);
                        }
                    }
                }
            }
        }

        console.log(labels);
        console.log(dataClients);
        console.log(dataServices);
        return [labels, dataClients, dataServices];
    }



    $('#option-select').change(function() {
        let id = $('#option-select').find('option:selected').attr('id');
        let optId = $('#option-select').find('option:selected').parent().attr('id');

        if ($('#option-select').find('option:selected').text() == "All") {
            // special parse
            let allData = constructDataAll();
            createGraph(allData[0], allData[1], allData[2], allData[3], allData[4]);
            return;
        } else {
            let optGroupJSONret = parseOptionSelected(id, optId);
            let optionData = handleGraphConversion(optGroupJSONret, id, optId);
            createGraph(optionData[0], optionData[1], optionData[2], id, optId);
        }
    });
});