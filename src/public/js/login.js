$(document).ready(function() {
    console.log("in login");

    
    $('#login-btn').click(function() {
        console.log("will login now");
        console.log("username is " + $("#orgTEQlogin").val() + " and apsswrd is " + $("#orgTEQPwd").val());
        
    });
});