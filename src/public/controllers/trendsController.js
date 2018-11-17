var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({extended: false});
var index = require(__dirname + '/../../index');
var db2 = index.db2;

function generateJson (docs, cb) {
    var res = [];

    for (i in docs) {
        var month = docs[i]['month'];
        var entries = docs[i]['entries'];
        res.push({'month': month, 'clients': entries.length, 'services': 0});

        for (j in entries) {
            var entry = entries[j];
            var input;

            if (typeof entry['Support Services Received'] !== 'undefined') {
                input = entry['Support Services Received'];
            } else if (typeof entry['Support services received'] !== 'undefined') {
                input = entry['Support services received'];
            }

            if (input === 'Yes') {
                res[i]['services']++;
            }
        }
    }

    res.sort((a, b) => parseInt(a.month.replace('-', '')) - parseInt(b.month.replace('-', '')));
    cb(res);
}

module.exports = function (app) {
    app.get('/trends', function (req, res) {
        res.render('trends');
    });

    app.get('/trends-graph', function (req, res) {
        res.render('trends-graph');
    });

    app.post('/generate-trends', urlencodedParser, function (req, res) {
        db2.find({template: req.body.template}, function (err, docs) {
            if (err) {
                res.send(500);
            } else {
                if (docs.length !== 0) {
                    generateJson(docs, function (response) {
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
}