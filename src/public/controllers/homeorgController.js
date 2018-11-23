var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/home-org", function(req, res) {
        res.render("home-org");
    })

    app.get("/", function(req, res) {
        res.render("login");
    })

};