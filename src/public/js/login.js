$(document).ready(function() {
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "true") {
       window.location.replace("/home-org");
    } else if (localStorage.loginTEQ == "true") {
        window.location.replace("/home");
    }

    $('#login-btn').click(function() {
        let data = {username: $("#orgTEQlogin").val(), password: $("#orgTEQPwd").val()};
        $.ajax({
            type: 'POST',
            url: '/login',
            data: data,
            success: function(response) {
                // get the type of account they are (teq or org)
                // setup local storage
                $.ajax({
                    type: 'GET', url: '/account/type', data: data,
                    success: function(response2) {
                        if (response2.type == "org") {
                            localStorage.setItem("loginOrg", "true"); localStorage.setItem("loginTEQ", "false");
                            window.location.replace("/home-org");
                        } else {
                            localStorage.setItem("loginOrg", "false"); localStorage.setItem("loginTEQ", "true");
                            window.location.replace("/home");
                        }
                    }
                });

                console.log("success");
                // reroute them based on the location data provides
            },
            error: function(response) {
                alert("Please make sure all fields are entered and correct.")
                console.log("something not right.");
            }
        });
    });
});