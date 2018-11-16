var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;
var optionsDb = index.optionsDb;


function generateJson (docs, cb) {
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
                'total': total
            }
        }
    */
   
    var entries = docs[0]['entries'];
    var entryCount = entries.length;
    var entryProc = 0;
    var res = {};
    var dobPatt = new RegExp('DATE OF BIRTH');

    for (i in entries) {
        let entry = entries[i];
        let headerCount = Object.keys(entry).length;
        let headerProc = 0;
        let servicesReceived = false;

        // check if service was received for this entry
        if ((typeof entry['Support Services Received'] !== 'undefined'
            && entry['Support Services Received'] === 'Yes')
            || (typeof entry['Support services received'] !== 'undefined'
            && entry['Support services received'] === 'Yes')) {
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
                            res[header] = {'options': {}, 'total': 0};
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

                        res[header]['total']++;
                    } else {
                        if (dobPatt.test(header)) {
                            // input is a date of birth
                            let age = calculateAge(input);

                            if (typeof res['AGE'] === 'undefined') {
                                res['AGE'] = {'options': {}, 'total': 0};
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

                            res['AGE']['total']++;
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

module.exports  = function (app) {
    app.get('/generate', function (req, res) {
        res.render('generate-page');
    });

    app.get('/generate/months', function(req, res) {
        db2.find({}, function (err, docs) {
            let availableMonths = {};

            for (i in docs) {
                let object = docs[i];
                let month = object['month'];
                let template = object['template'];

                if (typeof availableMonths[template] === 'undefined') {
                    availableMonths[template] = [month];
                } else if (availableMonths[template].indexOf(month) === -1) {
                    availableMonths[template].push(month);
                }
            }

            res.json(availableMonths);
            // res.render('generate-page');
        });
    });

    app.post('/generate', urlencodedParser, function (req, res) {
        var month = req.body.date;

        db2.find({month: month, template: req.body.template}, function (err, docs) {
            if (err) {
                res.send(500);
            } else {
                if (docs.length !== 0) {
                    generateJson(docs, function (response) {
                        // response is object containing report data
                        console.log(response);
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
