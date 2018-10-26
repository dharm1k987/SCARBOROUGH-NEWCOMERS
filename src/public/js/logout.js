$(document).ready(function() {
    $("#logout-btn").click(function() {
        localStorage.setItem("loginOrg", "false"); localStorage.setItem("loginTEQ", "false");
        window.location.replace("/login");
    });
});