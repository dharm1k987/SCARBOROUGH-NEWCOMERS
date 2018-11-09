var bodyParser = require("body-parser");
var index = require(__dirname + '/../../index');
var db = index.db;
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {
    app.use(bodyParser.json());

    app.get("/account/type", urlencodedParser, function(req, res) {
        db.find({"username": req.query.username, "password": req.query.password}, function(err, docs){
            if (docs.length == 0) {
                res.status(400);
                res.send();
            } else {
                if (docs.length === 0) {
                  res.send(300);
                } else {
                  var result = docs[0].type;
                  res.status(200);
                  console.log(docs);
                  res.send({type: result});
                }
            }
        });
    });



    app.post("/account/delete", urlencodedParser, function(req, res) {
      console.log("Delete Req:",req);
        var username = req.body.username;
        var password = req.body.password;
        console.log("inside delete", username, "Pass", password);
        db.find({ username: username }, function (err, docs) {
            if (docs.length != 0 && docs[0]["password"] == password) {
                console.log("found something");
                db.remove({ username: username }, function (err, numRemoved) {
                    res.status(200);
                    res.send()
                });
            } else {
                console.log("didnt find");
                res.status(400);
                res.send()

            }
        });
    });

};
