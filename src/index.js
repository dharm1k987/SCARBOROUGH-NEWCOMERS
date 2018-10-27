var express = require('express');
var path = require('path');

var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));


// ejs templates go to view folder
app.set('views', path.join(__dirname, 'public/views'));
app.set('img', path.join(__dirname, 'public/img'));
app.set('js', path.join(__dirname, 'public/js'));
app.set('controllers', path.join(__dirname, '/public/controllers'));

var loginController = require(__dirname + "/public/controllers/loginController");
var accountController = require(__dirname + "/public/controllers/accountController");
var uploadFileController = require(__dirname + "/public/controllers/uploadFileController");

var homeController = require(__dirname + "/public/controllers/homeController");
var helpController = require(__dirname + "/public/controllers/helpController");
var eventLogController = require(__dirname + "/public/controllers/eventLogController");
// we will use ejs template for the navbar
app.set("view engine", "ejs")

app.get("/", function(req, res) {
    res.render("index");
})

// fire controllers
loginController(app); 
accountController(app);
uploadFileController(app);

homeController(app);
helpController(app);
eventLogController(app);

console.log("listening on port ...")
app.listen(port);