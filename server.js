const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const PORT = 8080;

const app = express();
app.use(express.json());

const server = require("http").Server(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3002",
    methods: ["GET", "POST"],
  },
});

const rooms = new Map();

app.get("/", (req, res) => {
  res.send("Hello in the Web-Server! It's Me Mario");
});

app.get("/rooms/:id", (req, res) => {
  const { id: roomId } = req.params;
  const obj = rooms.has(roomId)
    ? {
        users: [...rooms.get(roomId).get("users").values()],
        messages: [...rooms.get(roomId).get("messages").values()],
      }
    : { users: [], messages: [] };
  res.json(obj);
});

app.post("/rooms", (req, res) => {
  const { roomId } = req.body;
  if (!rooms.has(roomId)) {
    rooms.set(
      roomId,
      new Map([
        ["users", new Map()],
        ["messages", []],
      ])
    );
  }
  res.send();
});

io.on("connection", (socket) => {
  socket.on("ROOM:JOIN", ({ roomId, userName }) => {
    socket.join(roomId);
    rooms.get(roomId).get("users").set(socket.id, userName);
    const users = [...rooms.get(roomId).get("users").values()];
    socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
  });

  socket.on("ROOM:NEW_MESSAGE", ({ roomId, userName, text }) => {
    const obj = {
      userName,
      text,
    };
    rooms.get(roomId).get("messages").push(obj);
    socket.broadcast.to(roomId).emit("ROOM:NEW_MESSAGE", obj);
  });

  socket.on("disconnect", () => {
    rooms.forEach((value, roomId) => {
      if (value.get("users").delete(socket.id)) {
        const users = [...value.get("users").values()];
        socket.broadcast.to(roomId).emit("ROOM:SET_USERS", users);
      }
    });
  });
});

server.listen(PORT, (err) => {
  if (err) {
    throw new Error("Something goes wrong:", err);
  }
  console.log(`Server Started on: http://127.0.0.1:${PORT}`);
});
