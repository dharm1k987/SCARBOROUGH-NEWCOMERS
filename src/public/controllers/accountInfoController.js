var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/account-info", function(req, res) {
        console.log("this page should be avialble to all members logged in... watch for that");
        res.render("account-info");
    })

};