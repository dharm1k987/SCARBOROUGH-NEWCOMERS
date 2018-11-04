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

    console.log("in generate");


    $("#generate-btn").click(function() {
        var e = document.getElementById("ddlViewBy");
        var option = e.options[e.selectedIndex].value;

        var data = {template: option};
        $.ajax({
            type: 'POST',
            url: '/generate',
            data: data,
            success: function(response) {
                // get the type of account they are (teq or org)
                // setup local storage
                console.log("success");

                // reroute them based on the location data provides
            },
            error: function(response) {
                console.log("something not right.");
            }
        });
    });

});