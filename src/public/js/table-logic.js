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

    var tableJSON = localStorage.getItem('tableJSON');
    var date = localStorage.getItem('date');
    var tableHeader = localStorage.tableHeader;
    tableJSON = JSON.parse(tableJSON);




    var combinedHeader = tableHeader + " - " + date;
    $(".main-body").append('<h1 style="color:white;">' + combinedHeader + '</h1>');
   // $(".main-body").append('<pre>' + tableJSON + '</pre>');

    var html = `
    <div style="max-height:700px;overflow-y: auto;background-color: white;">
    <table class="table table-bordered" style="background-color:white; border: 1px solid black;" id="printTable";>
    <thead>
    <tbody><tr>
    <th style="border:1px solid black;">Headers</th>
    <th style="border:1px solid black;">Values</th>

    </tbody></tr>
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
                var htmlHeaders = "<thead><tr><th>" + header + "</th><th></th></tr></thead><tbody>";
                var htmlOptions = "";
                // loop over the options
                for (var option in tableJSON[header]["options"]) {
                    // console.log("Header is " + header);
           //         console.log("Option " + option + " with total " + tableJSON[header]["options"][option]);
                    var htmlOptions = "<tr><td style='background-color:#efefef;border: 1px solid black;'>" + title(option) + "</td>" + "<td style='background-color:#efefef;border: 1px solid black;'>" + tableJSON[header]["options"][option]["clients"] + "</td>" + "</tr>";
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
                var css = "'background-color:#f5f5f5;border: 1px solid black;'";
               //  console.log("<tr><td style=" + css + ">" + "Total" + "</td>");
                html += "<tr><td style=" + css + ">" + "Total" + "</td>" + "<td style=" + css + ">" + tableJSON[header]["total"] + "</td>" + "</tr>";
            }

            html += "</tbody>"
        }
    }

    $(".main-body").append(html + "</table></div>");
    
    // printing button
    function printData()
    {

    var headerToPrint = '<h1 style="color:black; font-family: Overpass, sans-serif;">' + combinedHeader + '</h1>'
    var htmlToPrint = `
        <style type="text/css">
        table {
            background-color:white;
            border: 1px solid black;
            width: 100%;
            max-width: 100%;
            margin-bottom: 20px;
            border-spacing: 0;
            border-collapse: collapse;
            font-family: 'Overpass', sans-serif;
        }
        table th {
            border:1px solid black;
        }
        table td {

            -webkit-print-color-adjust:exact;
            background-color:#efefef;
            border: 1px solid black;
        }

        .table>tbody>tr>td, .table>tbody>tr>th, .table>tfoot>tr>td, .table>tfoot>tr>th, .table>thead>tr>td, .table>thead>tr>th {
            padding: 2px;
            line-height: 1.42857143;
            vertical-align: top;
        }
        </style>
    
    `



    var divToPrint=document.getElementById("printTable");
    newWin= window.open("");
    newWin.document.write(headerToPrint + htmlToPrint + divToPrint.outerHTML);
    newWin.print();
    newWin.close();
    }

    $('#print-btn').on('click',function(){
    printData();
    })
});