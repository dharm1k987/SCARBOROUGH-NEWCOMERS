var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {

    // app.use(bodyParser.json());
    app.get("/login", function(req, res) {
		console.log("login page");
        res.render("login");
    });

    app.post("/login", urlencodedParser, function(req, res) {
        // temp for testing
        var username = "username";
        var password = "password";

        // in real we match from database
        if (username == req.body.username && password == req.body.password) {
            res.status(200);
            res.send();
        } else {
            console.log("sending 400");
            res.status(400);
            res.send();
        }
    });
};
