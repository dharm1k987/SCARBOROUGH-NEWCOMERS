var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require("body-parser");
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;


function generateJson(docs, template) {
    var data = docs[0][template];
    var ret = {};
    // STRUCTURE
    /*
        {
            "header": {
                "options": {
                    "option": count
                },
                "total": total
            }
        }
    */
    
    for (i in data) {
        var entry = data[i];
        for (header in entry) {
            var input = entry[header];
            if (typeof ret[header] === "undefined")
                ret[header] = {"options": {}, "total": 0};
            if (typeof ret[header]["options"][input] === 'undefined')
                ret[header]["options"][input] = 1;
            else
                ret[header]["options"][input]++;
            ret[header]["total"]++;
        }
    }
}

module.exports  = function(app) {

    app.get("/generate", function(req, res) {
        console.log("this page should be avialble to teq members logged in... watch for that");
        res.render("generate-page");
    })    

    app.post('/generate', urlencodedParser, function(req, res) {
        
        console.log("in the api call");
        console.log(req.body.template);
        var template = req.body.template;

        templateObj = {};
        templateObj[template] = {$exists: true};
        db2.find(templateObj, function(err, docs){
            if (err) {
                console.log("err occured");
                res.send(500);
            } else {
                if (docs.length != 0) {
                    console.log("---------");
                    // console.log(docs[0]);
                    console.log("---------");
                    res.status(200);
                    res.json(docs[0]);
                    generateJson(docs, template);
                } else {
                    res.status(200);
                    res.json({});
                }
            }
        });
    });
};
