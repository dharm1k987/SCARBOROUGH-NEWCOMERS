var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;


function generateJson(docs, template, cb) {
    // OBJECT STRUCTURE
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
    var data = docs[0][template];
    var entryCount = data.length;
    var entryProc = 0;
    var res = {};

    for (i in data) {
        let entry = data[i];
        let headerCount = Object.keys(entry).length;
        let headerProc = 0;
        for (j in entry) {
            let header = j;
            let input = entry[header];
            let validOptions = null;
            optionsDb.find( { header: header }, function (err, docs) {
                // get valid options for this header
                if (docs.length == 0)
                    console.log("Header name '" + header + "' does not exist in the options database.");
                else
                    validOptions = docs[0]["options"];

                if (validOptions != null && validOptions.includes(input)) {
                    if (typeof res[header] === "undefined")
                        res[header] = {"options": {}, "total": 0};
                    if (typeof res[header]["options"][input] === 'undefined')
                        res[header]["options"][input] = 1;
                    else
                        res[header]["options"][input]++;
                    res[header]["total"]++;
                } else {
                    console.log("'" + input + "' is not an option for header '" + header + "'.");
                }

                // callback if all entries processed
                headerProc++;
                if (headerProc == headerCount) {
                    entryProc++;
                    if (entryProc == entryCount)
                        cb(res);
                }
            });
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
                    generateJson(docs, template, function(res) {
                        // object containing report data is in res
                        // console.log(res);
                    });
                } else {
                    res.status(200);
                    res.json({});
                }
            }
        });
    });
};
