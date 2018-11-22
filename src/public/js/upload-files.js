$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "true") {
        window.location.replace("/home");
        return;
    }
    
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
    $("#my-form").submit(function(e) {
        e.preventDefault();

        // first check to see if they selected a file
        if ($("#file-select-btn")[0].value == "") {
            alert("Please select a file");
            return;
        }
        var actionurl = e.currentTarget.action;

        console.log(actionurl);
        var formData = new FormData($("#my-form")[0]);
        $.ajax({
            url: actionurl,
            type: 'post',
            dataType: 'application/json',
            data: formData,
            contentType: false,
            processData: false,
            success: function(data) {
                if (data.status == "200") {
                    alert("File was uploaded.");
                    location.reload();
                } else {
                    alert("Something went wrong. Could not upload file.")
                }
            },
            error: function(err) {
                console.log(err);
                if (err.status == "200") {
                    alert("File was uploaded.");
                    location.reload();
                } else {
                    alert("Something went wrong. Could not upload file. " + err.responseText)
                }
            }
        });
    })
});