var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/generate", function(req, res) {
        console.log("this page should be avialble to teq members logged in... watch for that");
        res.render("generate-page");
    })

};