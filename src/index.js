var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

// singleton database module
var Datastore = require('nedb');
var db = new Datastore({filename: path.join(__dirname, 'public/db/account.db'), autoload: true});
var db2 = new Datastore({filename: path.join(__dirname, 'public/db/templates.db'), autoload: true});
var optionsDb = new Datastore({filename: path.join(__dirname, 'public/db/options.db'), autoload: true});
module.exports.db = db;
module.exports.db2 = db2;
module.exports.optionsDb = optionsDb;

app.use(express.static(__dirname + "/public"));

// ejs templates go to view folder
app.set('views', path.join(__dirname, 'public/views'));
app.set('img', path.join(__dirname, 'public/img'));
app.set('js', path.join(__dirname, 'public/js'));
app.set('controllers', path.join(__dirname, '/public/controllers'));
app.set('db', path.join(__dirname, '/public/db'));

var loginController = require(__dirname + "/public/controllers/loginController");
var accountController = require(__dirname + "/public/controllers/accountController");
var uploadFileController = require(__dirname + "/public/controllers/uploadFileController");
var createAccController = require(__dirname + "/public/controllers/createAccController");
var homeController = require(__dirname + "/public/controllers/homeController");
var helpController = require(__dirname + "/public/controllers/helpController");
var eventLogController = require(__dirname + "/public/controllers/eventLogController");
var homeorgController = require(__dirname + "/public/controllers/homeorgController");
var generateController = require(__dirname + "/public/controllers/generateController");
var tableController = require(__dirname + "/public/controllers/tableController");
// we will use ejs template for the navbar
app.set("view engine", "ejs")
console.log( path.join(__dirname, '/public/db'));


// fire controllers
loginController(app); 
accountController(app);
uploadFileController(app);
createAccController(app);
homeController(app);
helpController(app);
eventLogController(app);
homeorgController(app);
generateController(app);
tableController(app);


console.log("listening on port ...")
app.listen(port);