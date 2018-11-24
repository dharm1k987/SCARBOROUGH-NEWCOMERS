$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    var availableMonths;

    function populateMonths() {
        let template = $('#ddlViewBy').find('option:selected').val();

        // update dropdown
        $("#monthID").empty();
        for (i in availableMonths[template]) {
            let month = availableMonths[template][i];
            if (months.indexOf(month) < 0) {
                $("#monthID").append($('<option></option>').val(month).html(month));
            }
        }
    }

    $('#ddlViewBy').change(function() {
        populateMonths();
    });

    // get the months and add them to the dropdown
    months = [];
    $.ajax({
        type: 'GET',
        url: '/generate/months',
        data: {},
        success: function(response) {
            availableMonths = response;
            populateMonths();
        },
        error: function(response) {
            console.log("something not right.");
        }
    });

    $("#generate-btn").click(function() {
        let option = $('#ddlViewBy').find('option:selected').val();
        let monthID = $('#monthID').find('option:selected').val(); 

        var data = {template: option, date: monthID};

        $("#generate-btn").val("Generating ... ");
        $("#generate-btn").prop("disabled", true);
        $.ajax({
            type: 'POST',
            url: '/generate',
            data: data,
            success: function(response) {
                $("#generate-btn").val("Generate");
                $("#generate-btn").prop("disabled", false);
                // get the type of account they are (teq or org)
                // setup local storage
                console.log("success");
                console.log(response);
                localStorage.setItem("tableJSON", JSON.stringify(response));
                localStorage.setItem("tableHeader", option);
                localStorage.setItem("date", monthID);
                window.location.replace("/table-html");

                // reroute them based on the location data provides
            },
            error: function(response) {
                $("#generate-btn").val("Generate");
                $("#generate-btn").prop("disabled", false);
                console.log("something not right.");
            }
        });
    });
});