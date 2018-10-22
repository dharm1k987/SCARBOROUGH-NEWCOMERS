$(document).ready(function() {
    console.log("in login");
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "true") {
        console.log("already logged in, redirect to org");
        window.location.replace("/upload");
    } else if (localStorage.loginTEQ == "true") {
        console.log("already logged in, redirect to teq")
    }

    $('#login-btn').click(function() {
        var data = {username: $("#orgTEQlogin").val(), password: $("#orgTEQPwd").val()};
        $.ajax({
            type: 'POST',
            url: '/login',
            data: data,
            success: function(response) {
                // get the type of account they are (teq or org)
                // setup local storage
                // assume they are org
                localStorage.setItem("loginOrg", "true");
                window.location.replace("/upload");
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