var express = require("express");
var hbs = require("hbs");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var qrcode = require("qrcode-npm");
var uuid = require('node-uuid');
var port = 2018;
http.listen(port, function () {
    console.log("http://localhost:" + port);
});
app.use("/static", express.static(__dirname + "/public"));
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.set('views', __dirname + '/views');
app.get("/", function (req, res) {
    res.render("a");
});
app.get("/playb/:id", function (req, res) {
    res.render("b");
});
io.on("connection",function(socket){
    console.log("已连接");
    socket.on("registerRoom",function(data){
        console.log(data);
    });
});
