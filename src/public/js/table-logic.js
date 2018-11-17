var tableJSON;
var pieChart = null;

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
                backgroundColor: palette('cb-RdYlBu', options.length).map(function(hex) {
                    return '#' + hex;
                })
            }]
        },
        options: {
            responsive: true
        }
    });
}

$(document).ready(function() {
    console.log("in login");
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        // alert("Please login first");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        // alert("Please login first");
        return;
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
   // $(".main-body").append('<pre>' + tableJSON + '</pre>');

    var html = `
    <div style="height:80%;overflow-y: auto;background-color: white;">
    <table class="table table-bordered" style="background-color:white;">
    <thead>
    <tr>
    <th style="border-bottom:1px solid black;">Headers</th>
    <th style="border-bottom:1px solid black; width: 5%">Clients</th>
    <th style="border-bottom:1px solid black; width: 5%">Services</th>
    <th style="border-bottom:1px solid black; width: 5%">Service Received</th>

    </tr>
    </thead>
    

`;

{/* <tbody>
<tr>
<td>Cell</td>
<td>Cell</td>

</tr>

</tbody>
</table> */}


   // $(".main-body").append(html);


    for (var header in tableJSON) {
       //  console.log(header + " -> " + JSON.stringify(tableJSON[header]));
        // loop over the sub items
        for (var subitem in tableJSON[header]) {
         //   console.log("The subitem is " + subitem);
            if (subitem == "options") {
                var htmlHeaders = "<thead><tr><th>" + header 
                    + " <a class='chartBtn' data-header='" + header + "' data-toggle='modal' data-target='.bd-example-modal-lg' onclick='updateChart(this)'>(See chart)</a>"
                    + "</th><th></th></tr></thead><tbody>";
                var htmlOptions = "";
                // loop over the options
                for (var option in tableJSON[header]["options"]) {
                    // console.log("Header is " + header);
                    // console.log("Option " + option + " with total " + tableJSON[header]["options"][option]);
                    let servicePercent = (tableJSON[header]["options"][option]["services"] 
                        / tableJSON[header]["options"][option]["clients"]) * 100;
                    var htmlOptions = "<tr><td style='background-color:#efefef;'>" 
                        + title(option) + "</td>" 
                        + "<td style='background-color:#efefef;'>" + tableJSON[header]["options"][option]["clients"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + tableJSON[header]["options"][option]["services"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + servicePercent + "%</td>" 
                        + "</tr>";
                    console.log(tableJSON[header]["options"]);
                    console.log("--------");
                    htmlHeaders += htmlOptions; 
                    
                   // console.log(html);
                }
          //      console.log(htmlOptions);

                html += htmlHeaders;
                //$(".main-body").append(htmlOptions);
            } else if (subitem == "total") {
              //  console.log(JSON.stringify(tableJSON[header]));
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
});