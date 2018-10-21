$(document).ready(function() {
    console.log("in login");
    // if we are already logged in, we cannot be on the login page
    if (localStorage.loginOrg == "true") {
        console.log("already logged in, redirect to org");
        window.location.replace("/upload");
    } else if (localStorage.loginTEQ == "true") {
        console.log("already logged in, redirect to teq")
    }
    // temp for testing
    var username = "username";
    var password = "password";
    
    $('#login-btn').click(function() {
        if ($("#orgTEQlogin").val() == username && $("#orgTEQPwd").val() == password) {
            console.log("will login now");
            // get the type of account they are (teq or org)
            // setup local storage
            // assume they are org
            localStorage.setItem("loginOrg", "true");
            window.location.replace("/upload");
        } else {
            alert("Please make sure all fields are entered and correct.")
            console.log("something not right.");
        }

        
    });
});