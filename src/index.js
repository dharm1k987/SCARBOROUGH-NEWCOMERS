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
// we will use ejs template for the navbar
app.set("view engine", "ejs")

app.get("/", function(req, res) {
    res.render("index");
})



app.get("/upload", function(req, res) {
    console.log("this page should only be avialble to the members of supporting agencies is logged in... watch for that");
    res.render("uploading-page");
})



// fire controllers
loginController(app); 
accountController(app);

console.log("listening on port ...")
app.listen(port);