var express = require('express');
var path = require('path');
var app = express();
var cors = require('cors');
var port = process.env.PORT || 8080;

// singleton database modules
var Datastore = require('nedb');
var db = new Datastore({filename: path.join(__dirname, 'public/db/account.db'), autoload: true});
var templatesDb = new Datastore({filename: path.join(__dirname, 'public/db/templates.db'), autoload: true});
var optionsDb = new Datastore({filename: path.join(__dirname, 'public/db/options.db'), autoload: true});
var headersDb = new Datastore({filename: path.join(__dirname, 'public/db/headers.db'), autoload: true});
module.exports.db = db;
module.exports.templatesDb = templatesDb;
module.exports.optionsDb = optionsDb;
module.exports.headersDb = headersDb;
app.use(cors());
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
var homeorgController = require(__dirname + "/public/controllers/homeorgController");
var generateController = require(__dirname + "/public/controllers/generateController");
var tableController = require(__dirname + "/public/controllers/tableController");
var queryController = require(__dirname + "/public/controllers/queryController");
var setupController = require(__dirname + "/public/controllers/setupController");
var trendsController = require(__dirname + "/public/controllers/trendsController");

// we will use ejs template for the navbar
app.set("view engine", "ejs")

// fire controllers
loginController(app); queryController(app); accountController(app);
uploadFileController(app); createAccController(app); homeController(app);
helpController(app); homeorgController(app); tableController(app);
setupController(app); trendsController(app);
generateController.main(app); // because we export function from here

console.log("listening on port ...")
app.listen(port);
