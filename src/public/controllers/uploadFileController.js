var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require("body-parser");
var fs = require('fs');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;

// multer setup
var storage = multer.memoryStorage();
var upload = multer({ 
    storage: storage,
    fileFilter: function(req, file, cb) {
        // maybe check for filetype later?
        console.log("File type uploaded: " + file.mimetype);
        cb(null, true);
    }
});

function checkUnique(id) {
    console.log("the id is " + id);

    var result = fs.readFileSync("src/public/db/template_ids.txt").toString();
    var alreadyThere = result.includes(id.toString());

    if (alreadyThere) {
        console.log("aready there");
        return false;
    }

    // if I reach here, that means the id is not there, so add it
    fs.appendFile("src/public/db/template_ids.txt", "\n" + id.toString(), function(err) {
        if(err) {
            return console.log(err);
        }
    }); 

    return true;
}

module.exports  = function(app) {
    app.get("/upload", function(req, res) {
        console.log("this page should only be avialble to the members of supporting agencies is logged in... watch for that");
        res.render("uploading-page");
    });

    app.post('/upload', urlencodedParser, upload.single('csv'), function(req, res) {
        console.log(req);
        
        // file is cached in req.file.buffer
        
        var workbook = XLSX.read(req.file.buffer);
        var ignoreSheets = ["Data Fields", "Options Sheet"];
        var jsons = {};

        for (var i = 0; i < workbook.SheetNames.length; i++) {
            var sheetName = workbook.SheetNames[i];
            if (ignoreSheets.includes(sheetName))
                continue;

            var sheet = workbook.Sheets[sheetName];
            var range = XLSX.utils.decode_range(sheet['!ref']);
            var headers = [];

            // find headers
            var colNum;
            for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
                var nextCell = sheet[XLSX.utils.encode_cell({r: 1, c: colNum})];
                if (typeof nextCell === 'undefined')
                    headers.push(void 0);
                else
                    headers.push(nextCell.w);
            }
            console.log("headers are " + headers)

            jsons = XLSX.utils.sheet_to_json(sheet, {header: headers, range: 3});
        }



        console.log("-----start----")
        //console.log(jsons);
        console.log("-----end----")
        var template = req.body.template;
        var body = {};
        body[template] = jsons;
        //console.log("the body is " + JSON.stringify(req.body));
        //console.log("template is " + template);
        var check = checkUnique(body[template][0]["client_validation_id"]);
        console.log("check is " + check);
        if (check == false) {
            // we do not want to insert since it is already there
            console.log("got false as result");
            res.status(400);
            res.send('A file with this unique id already exists in our database. Please change the unique id.');
            return;
        }
        db2.insert(body , function(err, docs){
            if (err) {
                console.log(err);
                console.log("bad, i am sending 400");
                res.status(400);
                res.send({});
            } else {
                console.log("inseted properly");
                console.log("i am sending 200");
                res.status(200);
                res.send({});
            }
        });
        

        
        // json objects are in jsons
    });
};
