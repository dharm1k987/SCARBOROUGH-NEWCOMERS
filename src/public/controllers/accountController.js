var bodyParser = require("body-parser");
var index = require(__dirname + '/../../index');
var db = index.db;
var urlencodedParser = bodyParser.urlencoded({extended: false});

module.exports  = function(app) {

    app.get("/account", function(req, res) {
        console.log("this page should only be avialble the teq staff is logged in... watch for that");
        res.render("create-org-account");
    })

    app.get("/account/type", urlencodedParser, function(req, res) {
        db.find({"username": req.query.username, "password": req.query.password}, function(err, docs){
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

   
};
