const ENTER_ROOM = "enter_room";
const WELCOME = "welcome";
const LEAVE_ROOM = "leave_room";
const NEW_MESSAGE = "new_message";

const socket = io();

const welcome = document.querySelector("#welcome");
const welcomeForm = welcome.querySelector("form");
const room = document.querySelector("#room");

room.hidden = true;

let roomName;

const addMessage = (message) => {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
};

const showRoom = () => {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const roomForm = room.querySelector("form");
  roomForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = room.querySelector("input");
    const value = input.value;
    socket.emit(NEW_MESSAGE, input.value, roomName, () => {
      addMessage(`You: ${value}`);
    });
    input.value = "";
  });
};

welcomeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const input = welcomeForm.querySelector("input");
  socket.emit(ENTER_ROOM, roomName, showRoom);
  roomName = input.value;
  input.value = "";
});

socket.on(WELCOME, () => {
  addMessage("Someone joined");
});

socket.on(LEAVE_ROOM, () => {
  addMessage("Someone left");
});

socket.on(NEW_MESSAGE, (message) => {
  console.log(message);
});
