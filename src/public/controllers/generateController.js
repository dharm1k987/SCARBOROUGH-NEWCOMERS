var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require("body-parser");
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;




module.exports  = function(app) {

    app.get("/generate", function(req, res) {
        console.log("this page should be avialble to teq members logged in... watch for that");
        res.render("generate-page");
    })    

    app.post('/generate', urlencodedParser, function(req, res) {
        
        console.log("in the api call");
        console.log(req.body.template);
    });







        

        
        // json objects are in jsons
    
};
