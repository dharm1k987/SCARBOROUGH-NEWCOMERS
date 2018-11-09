var bodyParser = require("body-parser");


module.exports  = function(app) {

    app.get("/home", function(req, res) {
        console.log("this page should only be avialble to the members of TEQ is logged in... watch for that");
     
        res.render("home");
    })

};
