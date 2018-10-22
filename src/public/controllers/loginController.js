module.exports  = function(app) {
    var  bodyParser = require("body-parser");
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    app.get("/login", function(req, res) {
		console.log("login page");
        res.render("login");
    });

    app.post("/login", function(req, res) {
        // temp for testing
        var username = "username";
        var password = "password";

        // in real we match from database
        if (username == req.body.username && password == req.body.password) {
            res.status(200);
            res.send();
        } else {
            res.status(400);
            res.send("NOTFOUND");
        }
    });
};
