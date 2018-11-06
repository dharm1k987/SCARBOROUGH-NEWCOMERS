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

    var tableJSON = localStorage.getItem('tableJSON');
    var tableHeader = localStorage.tableHeader;
    console.log("table JSON is ",  JSON.parse(tableJSON));
    $(".main-body").append('<h1>' + tableHeader + '</h1>');
    $(".main-body").append('<pre>' + tableJSON + '</pre>');
    
});