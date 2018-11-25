var bodyParser = require("body-parser");
var index = require(__dirname + '/../../index');
var db = index.db;
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {
    app.use(bodyParser.json());
    
    app.get("/create", function(req, res) {
        res.render("create-acc");
    });
    // create an account
    app.post("/create", urlencodedParser, function(req, res) {
        db.find({"username": req.body.username}, function(err, docs){
            if (docs.length == 0) {
                // this means it does not exist, this is good
                db.insert( {"username": req.body.username, "password": req.body.password, "type": req.body.type}, function(err, docs){
                    console.log("inserted");
                });
                res.status(200);
                res.send();
            } else {
                // it exists, we cannot create
                res.status(400);
                res.send();
            }
        });
    })
};
