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
    var tableHeader = localStorage.tableHeader;
    tableJSON = JSON.parse(tableJSON);





    $(".main-body").append('<h1 style="color:white;">' + tableHeader + '</h1>');
   // $(".main-body").append('<pre>' + tableJSON + '</pre>');

    var html = `
    <div class="pre-scrollable" style="max-height:700px">
    <table class="table" style="background-color:white;">
    <thead>
    <tr>
    <th style="border-bottom:1px solid black;">Headers</th>
    <th style="border-bottom:1px solid black;">Values</th>

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
         console.log(header + " -> " + JSON.stringify(tableJSON[header]));
        // loop over the sub items
        for (var subitem in tableJSON[header]) {
            console.log("The subitem is " + subitem);
            if (subitem == "options") {
                var htmlHeaders = "<thead><tr><th>" + header + "</th><th></th></tr></thead><tbody>";
                var htmlOptions = "";
                // loop over the options
                for (var option in tableJSON[header]["options"]) {
                    // console.log("Header is " + header);
                    console.log("Option " + option + " with total " + tableJSON[header]["options"][option]);
                    var htmlOptions = "<tr><td style='background-color:#efefef;'>" + title(option) + "</td>" + "<td style='background-color:#efefef;'>" + tableJSON[header]["options"][option] + "</td>" + "</tr>";
                    //console.log(htmlOptions);
                    htmlHeaders += htmlOptions; 
                    //console.log(html);
                }
                console.log(htmlOptions);

                html += htmlHeaders;
                //$(".main-body").append(htmlOptions);
            } else if (subitem == "total") {
                console.log(JSON.stringify(tableJSON[header]));
                var css = "'background-color:#f5f5f5;border-bottom:1px solid black'";
               //  console.log("<tr><td style=" + css + ">" + "Total" + "</td>");
                html += "<tr><td style=" + css + ">" + "Total" + "</td>" + "<td style=" + css + ">" + tableJSON[header]["total"] + "</td>" + "</tr>";
            }

            html += "</tbody>"
        }
    }

    $(".main-body").append(html + "</table></div>");
    
});