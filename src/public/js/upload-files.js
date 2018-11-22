$(document).ready(function() {
    if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "false") {
        window.location.replace("/login");
        return;
    } else if (localStorage.loginOrg == "false" && localStorage.loginTEQ == "true") {
        window.location.replace("/home");
        return;
    }
    
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
        let actionurl = e.currentTarget.action;
        let formData = new FormData($("#my-form")[0]);
        // submit the form
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