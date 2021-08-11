"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var PORT = 3000;
var app = express_1.default();
//middlewares
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express_1.default.static(__dirname + "/public"));
app.get("/", function (_, res) { return res.render("home"); });
app.get("/*", function (_, res) { return res.redirect("/"); });
// CONSTANTS
var ENTER_ROOM = "enter_room";
var WELCOME = "welcome";
var DISCONNECTING = "disconnecting";
var LEAVE_ROOM = "leave_room";
var NEW_MESSAGE = "new_message";
// Server
var httpServer = http_1.default.createServer(app);
var io = new socket_io_1.Server(httpServer);
io.on("connection", function (socket) {
    socket.onAny(function (event) {
        console.log("Socket Event: " + event);
    });
    socket.on(ENTER_ROOM, function (roomName, done) {
        socket.join(roomName);
        done();
        socket.to(roomName).emit(WELCOME);
    });
    socket.on(DISCONNECTING, function () {
        socket.rooms.forEach(function (room) { return socket.to(room).emit(LEAVE_ROOM); });
    });
    socket.on(NEW_MESSAGE, function (msg, room, done) {
        socket.to(room).emit(NEW_MESSAGE, msg);
        done();
    });
});
var handleListen = function () { return console.log("Listening on http://localhost:" + PORT); };
httpServer.listen(PORT, handleListen);
