var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

module.exports  = function(app) {

    app.get("/upload", function(req, res) {
        console.log("this page should only be avialble to the members of supporting agencies is logged in... watch for that");
        res.render("uploading-page");
    });

    app.post('/upload', upload.single('csv'), function(req, res) {
        // file is cached in req.file.buffer
    });
};
