var bodyParser = require("body-parser");
var index = require(__dirname + '/../../index');
var db = index.db;
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {
    app.use(bodyParser.json());

    app.get("/login", function(req, res) {
        res.render("login");
    });
    // these are used for testing
    app.post("/fill", urlencodedParser, function(req, res) {
        db.insert( {"username": "test1", "password": "testpass", "type": "org"});
        res.status(200);
        res.send();
    });

    app.get("/fill", urlencodedParser, function(req, res) {

        db.find({"username": "test1", "password": "testpass"}, function(err, docs){
            if (docs.length == 0) {
                res.status(400);
                res.send();
            } else {
                res.status(200);
                let result = docs[0].type;
                res.send({type: result});
            }
        });
    });


    app.post("/login", urlencodedParser, function(req, res) {
        // check to see if username and password are found
        db.find({"username": req.body.username, "password": req.body.password}, function(err, docs){

            if (docs.length == 0 || err) {
                res.status(400);
                res.send();
            } else {
                res.status(200);
                let result = docs[0].type;
                res.send({type: result});
            }
        });
    });
};
