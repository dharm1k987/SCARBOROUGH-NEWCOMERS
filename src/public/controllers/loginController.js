var bodyParser = require("body-parser");
var Datastore = require('nedb');
var db = new Datastore({filename: 'src/public/db/account.db', autoload: true});
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {

    // app.use(bodyParser.json());
    app.get("/login", function(req, res) {
		console.log("login page");
        res.render("login");
    });

    app.post("/fill", urlencodedParser, function(req, res) {
        db.insert( {"username": "test1", "password": "testpass", "type": "org"});
        res.status(200);
        res.send();
    });

    app.get("/fill", urlencodedParser, function(req, res) {

        db.find({"username": "test1", "password": "testpass"}, function(err, docs){
            if (err) {
                res.status(400);
                res.send();
            } else {
                res.status(200);
                console.log(docs);
                var result = docs[0].type;
                res.send({type: result});
            }
        });
    });
    

    app.post("/login", urlencodedParser, function(req, res) {
        // temp for testing

        db.find({"username": req.body.username, "password": req.body.password}, function(err, docs){
            if (err) {
                res.status(400);
                res.send();
            } else {
                res.status(200);
                var result = docs[0].type;
                res.send({type: result});
            }
        });
        /*
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
        }*/
    });
};
