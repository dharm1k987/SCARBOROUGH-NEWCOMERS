$(document).ready(function() {
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    // convert a text to title case
    function title(str) {
        return str.replace(
            /\w\S*/g,
            function(text) {
                return text.charAt(0).toUpperCase() + text.substr(1).toLowerCase();
            }
        );
    }

    var tableJSON =  JSON.parse(localStorage.getItem('tableJSON'));
    var date = localStorage.getItem('date');
    var combinedHeader = localStorage.tableHeader + " - " + date;

    // add the header to the main body
    $(".main-body").append('<h1 style="color:white;">' + combinedHeader + '</h1>');
    var html = $.ajax({type: "GET", url: "/views/partials/table-headers.ejs", async: false}).responseText;

    // when the user click the "see chart", this is what we will show them
    $('.bd-example-modal-lg').on('show.bs.modal', function (e) {
        let header = ($(e.relatedTarget)[0]).getAttribute("data-header");
        let options = [];
        let counts = [];
        let chartHeader = document.getElementById("chartHeader");
        chartHeader.innerHTML = header;
        
        for (option in tableJSON[header]["options"]) {
            options.push(option);
            counts.push(tableJSON[header]["options"][option]["clients"]);
        }
        createGraph(options, counts);

      });

     var pieChart = null;

      // shuffle array
      function shuffle(array) {
          var currentIndex = array.length, temporaryValue, randomIndex;
      
          while (0 !== currentIndex) {
              randomIndex = Math.floor(Math.random() * currentIndex);
              currentIndex -= 1; temporaryValue = array[currentIndex];
              array[currentIndex] = array[randomIndex]; array[randomIndex] = temporaryValue;
          }
      
          return array;
      }

      
    function createGraph(options, counts) {
        var ctx = document.getElementById("pieChart");
            
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

    // sort options on the dropdown so they follow chronological order
    function sortOptions(options) {
        options.sort(function (a, b) {
            let aNum = parseInt(a, 10);
            let bNum = parseInt(b, 10)

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
        });
    }

    // creation of the table starts here
    for (var header in tableJSON) {
        // loop over the sub items
        for (var subitem in tableJSON[header]) {
         //   console.log("The subitem is " + subitem);
            if (subitem == "options") {
                let htmlHeaders = "<thead><tr><th>" + header 
                    + " <a class='chartBtn' data-header='" + header + "' data-toggle='modal' data-target='.bd-example-modal-lg''>(See chart)</a>"
                    + "</th><th></th><th></th><th></th></tr></thead><tbody>";
                let htmlOptions = "";
                // loop over the options
                let options = Object.keys(tableJSON[header]["options"]);
                sortOptions(options);

                for (var i in options) {
                    optObj = tableJSON[header]["options"][options[i]];
                    let servicePercent = ((optObj["services"] / optObj["clients"]) * 100).toFixed(0);
                    let htmlOptions = "<tr><td style='background-color:#efefef;'>" 
                        + title(options[i]) + "</td>" 
                        + "<td style='background-color:#efefef;'>" + optObj["clients"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + optObj["services"] + "</td>" 
                        + "<td style='background-color:#efefef;'>" + servicePercent + "%</td>" 
                        + "</tr>";

                    htmlHeaders += htmlOptions; 

                }

                html += htmlHeaders;
            } else if (subitem == "total") {
                let css = "'background-color:#f5f5f5;border-bottom:1px solid black'";
                let servicePercent = (tableJSON[header]["total"]["services"] / tableJSON[header]["total"]["clients"] * 100).toFixed(0);

               //  console.log("<tr><td style=" + css + ">" + "Total" + "</td>");
                html += "<tr><td style=" + css + ">" + "Total" + "</td>" + "<td style=" + css + ">" + tableJSON[header]["total"]["clients"] + "</td>" 
                    + "<td style=" + css + ">" + tableJSON[header]["total"]["services"] + "</td>"
                    + "<td style=" + css + ">" + servicePercent + "%</td>" 
                    + "</tr>";
            }

            html += "</tbody>"
        }
    }

    // add the table to the dom
    $(".main-body").append(html + "</table></div>");

    $('#print-btn').on('click',function(){

        let headerToPrint = '<h1 style="color:black; font-family: Overpass, sans-serif;">' + combinedHeader + '</h1>'
        let htmlToPrint = $.ajax({type: "GET", url: "/views/partials/print-table.ejs", async: false}).responseText;

        let divToPrint = document.getElementById("printTable");
        let newWin = window.open("");
        newWin.document.write(headerToPrint + htmlToPrint + divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    })

});