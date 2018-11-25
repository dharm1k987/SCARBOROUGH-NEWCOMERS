var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var templatesDb = index.templatesDb;
var optionsDb = index.optionsDb;


function generateJson (entries, cb) {
    var res = {};
    var entryCount = entries.length;
    var entryProc = 0;
    const dobPatt = new RegExp('DATE OF BIRTH');

    for (let i in entries) {
        let entry = entries[i];
        let headerCount = Object.keys(entry).length;
        let headerProc = 0;
        let servicesReceived = false;

        // check if service was received for this entry
        if (typeof entry['SUPPORT SERVICES RECEIVED'] !== 'undefined'
            && entry['SUPPORT SERVICES RECEIVED'] === 'YES') {
            servicesReceived = true; 
        }

        for (let header in entry) {
            let input = entry[header];
            let validOptions = null;

            optionsDb.find({ header: header }, function (err, docs) {
                // get valid options for this header
                if (docs.length > 0) {
                    // update object if input is a valid option
                    validOptions = docs[0]['options'];

                    if (validOptions != null && validOptions.includes(input)) {
                        updateOption(res, header, input, servicesReceived);
                    } else if (dobPatt.test(header)) {
                        // input is a date of birth
                        let age = calculateAge(input);

                        // find the interval the age is in
                        for (k = 0; k < 100; k += 4) {
                            if (age >= k && age < k + 4) {
                                let interval = k + '-' + (k + 4);
                                updateOption(res, 'AGE', interval, servicesReceived);
                                break;
                            }
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

function updateOption (obj, header, input, servicesReceived) {
    if (typeof obj[header] === 'undefined') {
        obj[header] = {'options': {}, 'total': {'clients': 0, 'services': 0}};
    }

    if (typeof obj[header]['options'][input] === 'undefined') {
        if (servicesReceived) {
            obj[header]['options'][input] = {'clients': 1, 'services': 1};
        } else {
            obj[header]['options'][input] = {'clients': 1, 'services': 0};
        }
    } else {
        if (servicesReceived) {
            obj[header]['options'][input]['clients']++;
            obj[header]['options'][input]['services']++;
        } else {
            obj[header]['options'][input]['clients']++;
        }
    }

    // update totals for header
    if (servicesReceived) {
        obj[header]['total']['clients']++;
        obj[header]['total']['services']++;
    } else {
        obj[header]['total']['clients']++;
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
 
module.exports.reportObj = generateJson;

module.exports.main = function (app) {
    app.get('/generate', function (req, res) {
        res.render('generate-page');
    });

    app.get('/generate/months', function(req, res) {
        templatesDb.find({}, function (err, docs) {
            let availableMonths = {};

            for (let i in docs) {
                let object = docs[i];
                let month = object['month'];
                let template = object['template'];

                if (typeof availableMonths[template] === 'undefined') {
                    availableMonths[template] = [month];
                } else if (availableMonths[template].indexOf(month) === -1) {
                    availableMonths[template].push(month);
                }
            }

            // sort all arrays
            for (i in availableMonths) {
                availableMonths[i].sort(function (a, b) {
                    return parseInt(a.replace('-', '')) - parseInt(b.replace('-', ''));
                });
            }
            
            res.json(availableMonths);
        });
    });

    app.post('/generate', urlencodedParser, function (req, res) {
        let month = req.body.date;

        templatesDb.find({month: month, template: req.body.template}, function (err, docs) {
            if (err) {
                res.send(500);
            } else {
                if (docs.length !== 0) {
                    let entries = docs[0]['entries'];
                    generateJson(entries, function (response) {
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
