$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    var tableJSON;
    var pieChart = null;

    $("#generate-btn").click(function() {
        var e = document.getElementById("ddlViewBy");
        var option = e.options[e.selectedIndex].value;

        $("#generate-btn").val("Generating ...");
        $("#generate-btn").prop("disabled", true);

        var data = {template: option};
        $.ajax({
            type: 'POST',
            url: '/generate-trends',
            data: data,
            success: function(response) {
                // get the type of account they are (teq or org)
                // setup local storage
                $("#generate-btn").val("Generate");
                $("#generate-btn").prop("disabled", false);
                console.log("success");
                console.log(response);
                localStorage.setItem("trendsJSON", JSON.stringify(response));
                localStorage.setItem("tableHeader", option);
                window.location.replace("/trends-graph");
            },
            error: function(response) {
                $("#generate-btn").val("Generate");
                $("#generate-btn").prop("disabled", false);
                console.log("something not right.");
            }
        });
    });
});