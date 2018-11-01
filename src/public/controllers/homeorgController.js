var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/home-org", function(req, res) {
        console.log("this page should only be avialble to the members of org is logged in... watch for that");
        res.render("home-org");
    })

    app.get("/", function(req, res) {
        // console.log("this page should only be avialble to the members of org is logged in... watch for that");
        res.render("login");
    })

};