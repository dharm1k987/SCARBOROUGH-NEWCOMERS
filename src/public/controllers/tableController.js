var bodyParser = require("body-parser");

module.exports  = function(app) {

    app.get("/table-html", function(req, res) {
        res.render("table-html");
    })
    
};
