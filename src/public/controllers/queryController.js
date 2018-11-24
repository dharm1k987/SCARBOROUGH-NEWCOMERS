var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;
var headersDb = index.headersDb;

function generateJson (entries, cb) {
    // OBJECT STRUCTURE
    /*
        {
            'header': {
                'options': {
                    'option': {
                        'clients': count,
                        'services': count
                    }
                },
                'total': {
                    'clients': count,
                    'services': count
                }
            }
        }
    */

    var entryCount = entries.length;
    var entryProc = 0;
    var res = {};
    var dobPatt = new RegExp('DATE OF BIRTH');

    for (i in entries) {
        let entry = entries[i];
        let headerCount = Object.keys(entry).length;
        console.log(headerCount);
        let headerProc = 0;
        let servicesReceived = false;

        // check if service was received for this entry
        if (typeof entry['SUPPORT SERVICES RECEIVED'] !== 'undefined'
            && entry['SUPPORT SERVICES RECEIVED'] === 'YES') {
            servicesReceived = true;
        }

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
                    validOptions = docs[0]['options'];
                    if (validOptions != null && validOptions.includes(input)) {
                        if (typeof res[header] === 'undefined') {
                            res[header] = {'options': {}, 'total': {'clients': 0, 'services': 0}};
                        }

                        if (typeof res[header]['options'][input] === 'undefined') {
                            if (servicesReceived) {
                                res[header]['options'][input] = {'clients': 1, 'services': 1};
                            } else {
                                res[header]['options'][input] = {'clients': 1, 'services': 0};
                            }
                        } else {
                            if (servicesReceived) {
                                res[header]['options'][input]['clients']++;
                                res[header]['options'][input]['services']++;
                            } else {
                                res[header]['options'][input]['clients']++;
                            }
                        }

                        // update totals
                        if (servicesReceived) {
                            res[header]['total']['clients']++;
                            res[header]['total']['services']++;
                        } else {
                            res[header]['total']['clients']++;
                        }
                    } else {
                        if (dobPatt.test(header)) {
                            // input is a date of birth
                            let age = calculateAge(input);

                            if (typeof res['AGE'] === 'undefined') {
                                res['AGE'] = {'options': {}, 'total': {'clients': 0, 'services': 0}};
                            }

                            // find the interval the age is in
                            for (k = 0; k < 100; k += 4) {
                                if (age >= k && age < k + 4) {
                                    let interval = k + '-' + (k + 4);
                                    if (typeof res['AGE']['options'][interval] === 'undefined') {
                                        if (servicesReceived) {
                                            res['AGE']['options'][interval] = {'clients': 1, 'services': 1};
                                        } else {
                                            res['AGE']['options'][interval] = {'clients': 1, 'services': 0};
                                        }
                                    } else {
                                        if (servicesReceived) {
                                            res['AGE']['options'][interval]['clients']++;
                                            res['AGE']['options'][interval]['services']++;
                                        } else {
                                            res['AGE']['options'][interval]['clients']++;
                                        }
                                    }

                                    break;
                                }
                            }

                            // update totals
                            if (servicesReceived) {
                                res['AGE']['total']['clients']++;
                                res['AGE']['total']['services']++;
                            } else {
                                res['AGE']['total']['clients']++;
                            }
                        } else {
                            console.log("'" + input + "' is not an option for header '" + header + "'.");
                        }
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


function calculateAge (birthDate) {
    let year = parseInt(birthDate.substring(0, 4), 10);
    let month = parseInt(birthDate.substring(5, 7), 10);
    let day = parseInt(birthDate.substring(9, 10), 10);
    let dobObj = new Date(year, month, day);
    let msDiff = Math.abs(new Date() - dobObj);
    return Math.floor(msDiff / 31536000000);
}

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
        var service = req.query.service.toUpperCase();
        var measure = req.query.measure.toLowerCase();
        var template = "Needs Assessment&Referrals";
        var month = "2018-9";
        console.log("inside query", service, "measure: ", measure, "template: ", template);
        // Get Entries Header from Specified Template Above
        db2.find({month: month, template: template}, function (err, docs) {
          if (err) {
            res.status(500);
            res.send()
          } else {
            console.log("Found Template", docs[0].entries);
            // Call the Generate Json function in generateController
            generateJson(docs[0].entries, function (response) {
                console.log("Found Entry", response);
                // response is object containing report data
                // Using JS enter the object to extract the specified Service & it's measure
                console.log("inside query", service, "measure: ", measure, "template: ", template);
                var result = response["OFFICIAL LANGUAGE OF PREFERENCE"]["options"][service][measure];
                console.log("RESULT:" , result);
                res.status(200);
                res.json(result);
            });
          }
        });
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
