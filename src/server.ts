import express from "express";
import http from "http";
import { Server } from "socket.io";
const PORT: number = 3000;

const app: express.Application = express();

//middlewares
app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res: express.Response) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

// CONSTANTS
const ENTER_ROOM: string = "enter_room";
const WELCOME: string = "welcome";
const DISCONNECTING: string = "disconnecting";
const LEAVE_ROOM: string = "leave_room";
const NEW_MESSAGE: string = "new_message";

// Server
const httpServer = http.createServer(app);
const io = new Server(httpServer);

io.on("connection", (socket) => {
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on(ENTER_ROOM, (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit(WELCOME);
  });
  socket.on(DISCONNECTING, () => {
    socket.rooms.forEach((room) => socket.to(room).emit(LEAVE_ROOM));
  });
  socket.on(NEW_MESSAGE, (msg, room, done) => {
    socket.to(room).emit(NEW_MESSAGE, msg);
    done();
  });
});

const handleListen = () => console.log(`Listening on http://localhost:${PORT}`);

httpServer.listen(PORT, handleListen);
