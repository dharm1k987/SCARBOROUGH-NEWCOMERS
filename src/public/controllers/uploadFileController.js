var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/upload", function(req, res) {
        console.log("this page should only be avialble to the members of supporting agencies is logged in... watch for that");
        res.render("uploading-page");
    })

};
