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
    if (req.params.id) {
        console.log(req.params.id);
        res.render("b", {
            data: req.params.id
        });
    }
});
var onlineRooms = {};
var roomid = null;
var count = 0;
io.sockets.on("connection", function (socket) {
    console.log("已连接");
    socket.on("registerRoom", function (data) {
        console.log(data);
        roomid = data;
        if (!onlineRooms.hasOwnProperty(data)) {
            var room = {
                id: data,
                user: []
            };
            socket.emit("registerSuccess", room.id);
            onlineRooms[data] = room;
            console.log(onlineRooms);
            socket.join(data);
        } else {
            socket.emit("roomExist");
        }
    });
    socket.on("playbJoin", function (data) {
        if (roomid) {
            if (onlineRooms[roomid].user.length < 1) {
                if (data == roomid) {
                    count++;
                    var user = {
                        uid: roomid + count
                    };
                    onlineRooms[roomid].user.push(user);
                    socket.join(data);
                    io.sockets.to(roomid).emit("playbJoin");
                    socket.on("playbClickJoin", function () {
                        console.log("用户B点击了join按钮");
                        io.sockets.to(data).emit("playbClickJoin");
                    });
                }
            } else {
                io.sockets.to(roomid).emit('phoneEnough');
            }
        } else {
            console.log("请先注册房间");
        }
    });
    socket.on("playaClickStart", function () {
        console.log("用户A点击了start按钮");
        io.sockets.to(roomid).emit("playaClickStart");
    });
    socket.on("playaBarEnd",function(){
        io.sockets.to(roomid).emit("playbBarStart");
    });
    socket.on("playbBarEnd",function(){
        io.sockets.to(roomid).emit("play");
    });
    socket.on("disconnect", function () {
        console.log("断开连接");
    });
});