var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;


function generateJson (docs, cb) {
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
   
    var entries = docs[0]["entries"];
    var entryCount = entries.length;
    var entryProc = 0;
    var res = {};

    for (i in entries) {
        let entry = entries[i];
        let headerCount = Object.keys(entry).length;
        let headerProc = 0;

        for (j in entry) {
            let input = entry[j].toUpperCase();
            let header = j.toUpperCase();
            let validOptions = null;
            
            optionsDb.find({ header: header }, function (err, docs) {
                // get valid options for this header
                if (docs.length === 0) {
                    console.log("Header name '" + header + "' does not exist in the options database.");
                } else {
                    // update object if input is a valid option
                    validOptions = docs[0]["options"];
                    if (validOptions != null && validOptions.includes(input)) {
                        if (typeof res[header] === "undefined") {
                            res[header] = {"options": {}, "total": 0};
                        }

                        if (typeof res[header]["options"][input] === 'undefined') {
                            res[header]["options"][input] = 1;
                        } else {
                            res[header]["options"][input]++;
                        }

                        res[header]["total"]++;
                    } else {
                        console.log("'" + input + "' is not an option for header '" + header + "'.");
                    }
                }

                // callback if all entries processed
                headerProc++;
                if (headerProc === headerCount) {
                    entryProc++;
                    if (entryProc === entryCount) { 
                        cb(res);
                    }
                }
            });
        }
    }
}

module.exports  = function (app) {
    app.get("/generate", function (req, res) {
            res.render("generate-page");
       
    });

    app.get('/generate/months', function(req, res) {

        db2.find({}, function (err, docs) {
            var availableMonths = {};

            for (i in docs) {
                let object = docs[i];
                let month = object["month"];
                let template = object["template"];

                if (typeof availableMonths[template] === 'undefined') {
                    availableMonths[template] = [month];
                } else if (availableMonths.indexOf(month) === -1) {
                    availableMonths[template].push(month);
                }
            }

            // TODO: send available months to front end
            res.json(availableMonths);
           // res.render("generate-page");
        });



    });

    app.post('/generate', urlencodedParser, function (req, res) {
        // TODO: add selector for month
        console.log("in generate controller POST, req is" + JSON.stringify(req.body));
        var month = req.body.date;

        db2.find({month: month, template: req.body.template}, function (err, docs) {
            if (err) {
                res.send(500);
            } else {
                if (docs.length !== 0) {
                    generateJson(docs, function (response) {
                        // response is object containing report data
                        res.status(200);
                        res.json(response);
                    });
                } else {
                    res.status(200);
                    res.json({});
                }
            }
        });
    });
};
