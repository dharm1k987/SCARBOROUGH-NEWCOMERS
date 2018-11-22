$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "true" && localStorage.loginTEQ == "false") {
        window.location.replace("/home-org");
        return;
    }

    // if we are already logged in, we cannot be on the login page
    radio = "";
    $('#create-btn').click(function() {
        if ($('input[id="orgRadio"]:checked').val() == "on") { radio = "org"; }
        else { radio = "teq"; }
        var data = {username: $("#CreateUsername").val(), password: $("#CreatePwd").val(), type: radio};

        if ($("#CreateUsername").val() == "" || $("#CreatePwd").val() == "") {
            alert("Please make sure all fields are entered and correct.");
            return;
        }

        // check if all input fields filled out
        
        $.ajax({
            type: 'POST',
            url: '/create',
            data: data,
            success: function(response) {
                alert("Account inserted");
                location.reload();
                console.log("success");
                // reroute them based on the location data provides
            },
            error: function(response) {
                alert("Error. This account already exists in the db.")
                console.log("something not right.");
            }
        });
        
      
    });
});