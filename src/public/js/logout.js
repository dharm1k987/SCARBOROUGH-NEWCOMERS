$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    }
    
    $("#logout-btn").click(function() {
        localStorage.setItem("loginOrg", "false"); localStorage.setItem("loginTEQ", "false");
        window.location.replace("/login");
    });
});