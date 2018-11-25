var bodyParser = require("body-parser");
var index = require(__dirname + '/../../index');
var db = index.db;
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {
    app.use(bodyParser.json());
    // returns the type of account, teq or org
    app.get("/account/type", urlencodedParser, function(req, res) {
        db.find({"username": req.query.username, "password": req.query.password}, function(err, docs){
            if (docs.length == 0) {
                res.status(400);
                res.send();
            } else {
                if (docs.length === 0) {
                  res.send(300);
                } else {
                  let result = docs[0].type;
                  res.status(200);
                  res.send({type: result});
                }
            }
        });
    });
    // deletes an account
    app.post("/account/delete", urlencodedParser, function(req, res) {
        let username = req.body.username;
        let password = req.body.password;
        db.find({ username: username }, function (err, docs) {
            if (docs.length != 0 && docs[0]["password"] == password) {
                db.remove({ username: username }, function (err, numRemoved) {
                    res.status(200);
                    res.send()
                });
            } else {
                res.status(400);
                res.send()
            }
        });
    });
};
