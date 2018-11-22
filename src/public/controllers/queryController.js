var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;
var headersDb = index.headersDb;

module.exports  = function(app) {
    app.use(bodyParser.json());

    // Template: Which Language (X) service has the most Clients (Y) NEEDS TEMPLATE INDENTIFIER
    // Example: Which X service has the most Y.
    // X = Service (HEADER), Y = Services or Clients (MEASURE), Z = Tempalte Name
    /*
    Pass template to GenerateJson in generate controllers
    Get object structure back.
    Loop through object structure to find specific data
    Return that data point.
    */
    app.post("/query/test", urlencodedParser, function(req, res) {

        console.log("Custom Query Req", req);
        var service = req.body.service;
        var measure = req.body.measure;
        var template = "Needs Assessment&Referrals";
        console.log("inside query", service, "measure: ", measure, "templates: ", template);
        // Get Entries Header from Specified Template Above
        // Call the Generate Json function in generateController
        // Using JS enter the object to extract the specified Service & it's measure
        const result = -1;
        return result;
    });
    // app.post("/query/custom", urlencodedParser, function(req, res) {
    //
    //     console.log("Custom Query Req", req);
    //     var service = req.body.service;
    //     var measure = req.body.measure;
    //     console.log("inside query", service, "measure: ", measure);
    //     db.find({ username: username }, function (err, docs) {
    //         if (docs.length != 0 && docs[0]["password"] == password) {
    //             console.log("found something");
    //             db.remove({ username: username }, function (err, numRemoved) {
    //                 res.status(200);
    //                 res.send()
    //             });
    //         } else {
    //             console.log("didnt find");
    //             res.status(400);
    //             res.send()
    //         }
    //     });
    //
    // });
};
