var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
// ejs templates go to view folder
app.set('views', path.join(__dirname, 'public/views'));
app.set('img', path.join(__dirname, 'public/img'));

// we will use ejs template for the navbar
app.set("view engine", "ejs")

app.get("/", function(req, res) {
    res.render("index");
})

app.get("/account", function(req, res) {
    res.render("create-org-account");
})

console.log("listening on port ...")
app.listen(port);