var bodyParser = require("body-parser");
var bodyParser = require("body-parser");
var Datastore = require('nedb');
var db = new Datastore({filename: 'src/public/db/account.db', autoload: true});
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {

    app.get("/create", function(req, res) {
        res.render("create-acc");
    });

    app.post("/create", urlencodedParser, function(req, res) {
       console.log("in create controller");
        db.find({"username": req.body.username, "password": req.body.password}, function(err, docs){
            console.log(docs);
            if (docs.length == 0) {
                console.log("i di dnot find it");
                // this means it does not exist, this is good
                db.insert( {"username": req.body.username, "password": req.body.password, "type": req.body.type}, function(err, docs){
                    console.log("inserted");
                });
                res.status(200);
                res.send();
            } else {
                console.log("it failed, not empty");
                // it exists, we cannot create
                res.status(400);
                res.send();
            }
        });
    })

    app.post("/create/type", function(req, res) {
        // this function should call the database and return the type of account
        // TEQ or org
        console.log(req);
        console.log("username account is from accountController" + req.query.username);

        // temp for testing
        var username = "username";
        var password = "password";

        res.status(200);
        res.send({type:"org"});
    });
};




















