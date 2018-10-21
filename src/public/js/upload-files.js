$(document).ready(function() {
    console.log("in upload-files");
    console.log($('org-create-btn'));
    
    $('#org-create-btn').click(function() {
        console.log("will first check if all valid");
        console.log("will then call api");
        console.log("will insert following in db: " + $("#orgID").val() + " " + $("#orgPwd").val());
    });
});