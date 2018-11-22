$(document).ready(function() {
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    var tableJSON;
    var pieChart = null;

    // break this up into multiple functions
    function updateChart (btn) {
        var ctx = document.getElementById("pieChart");
        var header = btn.getAttribute("data-header");
        var options = [];
        var counts = [];

        var chartHeader = document.getElementById("chartHeader");
        chartHeader.innerHTML = header;
        
        for (option in tableJSON[header]["options"]) {
            options.push(option);
            counts.push(tableJSON[header]["options"][option]["clients"]);
        }

        if (pieChart != null) {
            pieChart.destroy();
        }

        pieChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: options,
                datasets: [{
                    data: counts,
                    backgroundColor: shuffle(palette('tol-rainbow', options.length).map(function(hex) {
                        return '#' + hex;
                    }))
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
    
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
    
        return array;
    }

    function title(str) {
        return str.replace(
            /\w\S*/g,
            function(text) {
                return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
            }
        );
    }

    tableJSON = localStorage.getItem('tableJSON');
    var date = localStorage.getItem('date');
    var tableHeader = localStorage.tableHeader;
    tableJSON = JSON.parse(tableJSON);

    var combinedHeader = tableHeader + " - " + date;
    $(".main-body").append('<h1 style="color:white;">' + combinedHeader + '</h1>');
    var html = `

    <div style="height:80%;overflow-y: auto;background-color: white;">
    <table class="table table-bordered" style="background-color:white;" id="printTable">
    <thead>
    <tr>
    <th style="border-bottom:1px solid black;">Headers</th>
    <th style="border-bottom:1px solid black; width: 5%">Clients</th>
    <th style="border-bottom:1px solid black; width: 5%">Services</th>
    <th style="border-bottom:1px solid black; width: 5%">Service Received</th>


    </tbody></tr>
    </thead>
    

`;

    for (var header in tableJSON) {
        // loop over the sub items
        for (var subitem in tableJSON[header]) {
         //   console.log("The subitem is " + subitem);
            if (subitem == "options") {
                var htmlHeaders = "<thead><tr><th>" + header 
                    + " <a class='chartBtn' data-header='" + header + "' data-toggle='modal' data-target='.bd-example-modal-lg' onclick='updateChart(this)'>(See chart)</a>"
                    + "</th><th></th><th></th><th></th></tr></thead><tbody>";
                var htmlOptions = "";
                // loop over the options
                var options = Object.keys(tableJSON[header]["options"]);
                options.sort();
                for (var i in options) {
                    optObj = tableJSON[header]["options"][options[i]];
                    let servicePercent = ((optObj["services"] / optObj["clients"]) * 100).toFixed(0);
                    var htmlOptions = "<tr><td style='background-color:#efefef;'>" 
                        + title(options[i]) + "</td>" 
                        + "<td style='background-color:#efefef;'>" + optObj["clients"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + optObj["services"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + servicePercent + "%</td>" 
                        + "</tr>";

                    htmlHeaders += htmlOptions; 

                }

                html += htmlHeaders;
            } else if (subitem == "total") {
                var css = "'background-color:#f5f5f5;border-bottom:1px solid black'";
                let servicePercent = tableJSON[header]["total"]["services"] / tableJSON[header]["total"]["clients"] * 100;

               //  console.log("<tr><td style=" + css + ">" + "Total" + "</td>");
                html += "<tr><td style=" + css + ">" + "Total" + "</td>" + "<td style=" + css + ">" + tableJSON[header]["total"]["clients"] + "</td>" 
                    + "<td style=" + css + ">" + tableJSON[header]["total"]["services"] + "</td>"
                    + "<td style=" + css + ">" + servicePercent + "%</td>" 
                    + "</tr>";
            }

            html += "</tbody>"
        }
    }

    $(".main-body").append(html + "</table></div>");


    $('#print-btn').on('click',function(){
        
        var headerToPrint = '<h1 style="color:black; font-family: Overpass, sans-serif;">' + combinedHeader + '</h1>'
        var htmlToPrint;
        $.get('/views/print-table.ejs', function(data) {
            htmlToPrint = data;
        }, 'text');

        htmlToPrint = $.ajax({type: "GET", url: "/views/print-table.ejs", async: false}).responseText;

        var divToPrint=document.getElementById("printTable");
        newWin= window.open("");
        newWin.document.write(headerToPrint + htmlToPrint + divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    })

});