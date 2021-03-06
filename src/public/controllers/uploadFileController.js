var XLSX = require('xlsx');
var multer = require('multer');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var templatesDb = index.templatesDb;
var optionsDb = index.optionsDb;
var headersDb = index.headersDb;

// multer setup
var storage = multer.memoryStorage();
var upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        // maybe check for filetype later?
        console.log('File type uploaded: ' + file.mimetype);
        cb(null, true);
    }
});

// loads the options for a specific type of template, so we can check if it is valid or not
// the user can't upload a "Client Profile", but use the template for "Info&Orien"
function loadOptions (workbook) {
    // clear options db
    optionsDb.remove({}, { multi: true }, function (err, numRemoved) {});

    // find sheet named Options Sheet otherwise use first sheet
    let sheet = ""; let colNum = ""; let rowNum = "";
    if (typeof workbook.Sheets['Options Sheet'] !== 'undefined') {
        sheet = workbook.Sheets['Options Sheet'];
    } else {
        sheet = workbook.Sheets[workbook.SheetNames[0]]
    }

    let range = XLSX.utils.decode_range(sheet['!ref']);
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        let header, col = [];
        let headerCell = sheet[XLSX.utils.encode_cell({r: 1, c: colNum})];
        if (typeof headerCell === 'undefined') {
            continue;
        } else {
            header = headerCell.w.toUpperCase();
        }

        for (rowNum = range.s.r + 2; rowNum <= range.e.r; rowNum++) {
            var nextCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: colNum})];
            if (typeof nextCell === 'undefined') {
                continue;
            } else {
                col.push(nextCell.w.toUpperCase());
            }
        }

        optionsDb.insert({'header': header, 'options': col});
    }
}

// makes an array of all headers in the sheet for a specific row
function parseTemplateHeaders (sheet, rowNum) {
    let headers = [];
    let colNum;
    let range = XLSX.utils.decode_range(sheet['!ref']);
    for (colNum = range.s.c; colNum <= range.e.c; colNum++) {
        let nextCell = sheet[XLSX.utils.encode_cell({r: rowNum, c: colNum})];
        if (typeof nextCell === 'undefined') {
            headers.push(void 0);
        } else {
            headers.push(nextCell.w.toUpperCase());
        }
    }

    return headers;
}

// first time we upload template, we sample the important sheets
function sampleHeaders (template, workbook) {
    // find sheet with template name as name, otherwise take the first sheet
    let sheet = (typeof workbook.Sheets[template] !== 'undefined') 
        ? workbook.Sheets[template] 
        : workbook.Sheets[workbook.SheetNames[0]];
    let headers = parseTemplateHeaders(sheet, 2).map(a => a.toUpperCase());
    headersDb.insert({'template': template, 'headers': headers});
    return headers;
}

// finds the sheet with the valid header, then parses it
function findAndParseSheet (workbook, validHeaders) {
    let json = null;
    for (var i = 0; i < workbook.SheetNames.length; i++) {
        let sheet = workbook.Sheets[workbook.SheetNames[i]];
        let headers = parseTemplateHeaders(sheet, 2);
        // check if headers all valid headers
        let valid = headers.every(val => validHeaders.includes(typeof val !== 'undefined' ? val.toUpperCase() : ''));
        if (valid) {
            json = XLSX.utils.sheet_to_json(sheet, {header: headers, range: 3});
            break;
        }
    }

    // convert everything to uppercase
    for (let i in json) {
        let entry = json[i];
        for (let j in entry) {
            if (typeof entry[j] !== 'string') entry[j] = entry[j].toString();
            entry[j] = entry[j].toUpperCase();
        }
    }

    return json;
}

// inserts data after parsing into the database
function insertToDb (monthStr, template, json, cb) {
    templatesDb.find({ month: monthStr, template: template }, function (err, docs) {
        if (docs.length === 0) {
            templatesDb.insert({month: monthStr, template: template, entries: json});
        } else {
            let entries = docs[0]['entries'];
            let pushed = 0;
            let skipped = 0;
            for (let i in json) {
                let entry = json[i];
                let uniqueField = 'UNIQUE IDENTIFIER VALUE';

                if (template === 'LT Course Setup') {
                    uniqueField = 'COURSE CODE';
                }

                let uniqueId = entry[uniqueField];
                // check if an entry with the ID already exists
                let matchIds = entries.filter(dbEntry => (dbEntry[uniqueField] === uniqueId));
                if (matchIds.length === 0) {
                    templatesDb.update({ month: monthStr, template: template }, { $push: { entries: entry } }, {});
                    pushed++;
                } else {
                    console.log('Entry with ID ' + uniqueId + ' already exists, skipping.');
                    skipped++;
                }
            }
        }

        cb();
    });
}

// this is used to populate the data for sample purposes
function insertRandomData (template, json, cb) {
    let year = 2018;
    let month = Math.floor((Math.random() * 6) + 4);
    let monthStr = year + '-' + month;

    randomizeOptions(template, json, function (newJson) {
        insertToDb(monthStr, template, newJson, cb);
    });
}
// this is again used for testing
function randomizeOptions (template, json, cb) {
    var newJson = json.slice(0);

    headersDb.find({ template: template }, function (err, docs) {
        const dobPatt = new RegExp('DATE OF BIRTH');
        let headers = docs[0]['headers'];      
        let entriesProc = 0;

        for (let entryNum in newJson) {
            let entry = newJson[entryNum];
            let headersProc = 0;
            for (let headerNum in headers) {
                let header = headers[headerNum];
                if (dobPatt.test(header)) {
                    let year = Math.floor((Math.random() * 60) + 1940);
                    let month = ('0' + Math.floor((Math.random() * 12) + 1)).slice(-2);
                    let day = ('0' + Math.floor((Math.random() * 30) + 1)).slice(-2);
                    let dateStr = year + '-' + month + '-' + day;
                    entry[header] = dateStr;
                }

                optionsDb.find({header: header}, function (err, docs) {
                    if (docs.length > 0) {
                        let options = docs[0]['options'];
                        if (options.length > 0) {
                            let randomOpt = options[Math.floor(Math.random() * options.length)];
                            entry[header] = randomOpt;
                        }
                    }

                    let uniqueField = 'UNIQUE IDENTIFIER VALUE';
                    if (template === 'LT Course Setup') {
                        uniqueField = 'COURSE CODE';
                        entry[uniqueField] = 'L-CCSMAR' + Math.floor((Math.random() * 10000) + 1);
                    } else {
                        entry[uniqueField] = '' + Math.floor((Math.random() * 999999) + 1);
                    }

                    headersProc++;
                    if (headersProc == headers.length) {
                        entriesProc++;
                        if (entriesProc == newJson.length) {
                            cb(newJson);
                        }
                    }
                });
            }
        }
    });
}

module.exports  = function (app) {
    app.get('/upload', function (req, res) {
        // console.log('this page should only be avialble to the members of supporting agencies is logged in... watch for that');
        res.render('uploading-page');
    });

    app.post('/upload', urlencodedParser, upload.single('csv'), function (req, res) {
        // file is cached in req.file.buffer
        var workbook = XLSX.read(req.file.buffer);

        if (req.body.template === 'Options Sheet') {
            loadOptions(workbook);
            console.log('Options database updated.')
            return;
        }

        // get valid headers for the selected template type
        headersDb.find({ template: req.body.template }, function (err, docs) {
            // get or initialize valid headers
            var validHeaders;
            if (docs.length === 0) {
                validHeaders = sampleHeaders(req.body.template, workbook);
            } else {
                validHeaders = docs[0]['headers'];
            }

            var json = findAndParseSheet(workbook, validHeaders);
            if (json == null) {
                res.status(400);
                res.send('Headers not valid.');
            } else {
                // use current month for month
                let date = new Date();
                let year = date.getUTCFullYear();
                let month = date.getUTCMonth() + 1;
                let monthStr = year + '-' + month;

                insertToDb(monthStr, req.body.template, json, function () {
                    res.status(200);
                    res.send({});
                });
            }
        });
    });
};
