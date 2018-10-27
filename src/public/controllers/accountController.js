var bodyParser = require("body-parser");
// var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {

    app.get("/account", function(req, res) {
        console.log("this page should only be avialble the teq staff is logged in... watch for that");
        res.render("create-org-account");
    })

    app.get("/account/type", function(req, res) {
        // this function should call the database and return the type of account
        // TEQ or org
        console.log(req);
        console.log("username account is from accountController" + req.query.username);

        // temp for testing
        var username = "username";
        var password = "password";

        res.status(200);
        res.send({type:"teq"});
    });
};
