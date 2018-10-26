$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        // alert("Please login first");
        return;
    }
    console.log("in upload-files");
    console.log($('org-create-btn'));
    
    $('#org-upload-btn').click(function() {
        console.log("will first check if all valid");
        console.log("will then call api");
        console.log("description is " + $("#description").val() + " and dropdown val is " + $(".dropdown-upload").text());
    });

    // dropdown select
    $(".dropdown-menu li a").click(function(){

       $(".dropdown-upload").text($(this).text()).append(' <span class="caret"></span>');
  
     });

    // file select
    $("#org-select-btn").click(function() {
        console.log("byron file opener");
    })
});