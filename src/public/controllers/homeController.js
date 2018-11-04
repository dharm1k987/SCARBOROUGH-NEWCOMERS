var bodyParser = require("body-parser");
var tableify = require("tableify");

module.exports  = function(app) {

    app.get("/home", function(req, res) {
        console.log("this page should only be avialble to the members of TEQ is logged in... watch for that");
        var temp = [
            {
                "Top 10 Language of Service": {
                    "English": 2000,
                    "Mandarin": 2000,
                    "Arabic": 2000,
                    "Spanish": 2000
                },
                "Total Count (all clients)": 8000
            },
            {
                "Preferred Official Language": {
                    "English": 3000,
                    "French": 3000,
                    "Unknown/No Preference": 2000
                },
                "Total Count (all clients)": 8000
            },
            {
                "CIC Program Needs": {
                    "Increase knowledge of": {
                        "Life in Canada - Identified Need": {
                            "Referral - Yes": 2000,
                            "Referral - No": 2000
                        },
                        "Community and Government Services - Identified Need": {
                            "Referral - Yes": 2000,
                            "Referral - No": 2000
                        }
                    },
                    "Overall Unique Count (identified need to increase knowledge)": 5000
                }
            }
        ];
        var html = tableify(temp);
        console.log(html);
        res.render("home");
    })

};
