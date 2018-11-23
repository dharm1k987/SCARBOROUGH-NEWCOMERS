var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/event", function(req, res) {
        res.render("event-log");
    })    

};
