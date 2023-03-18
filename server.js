const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const PORT = 8080;

const app = express();
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

app.get("/rooms", (req, res) => {
  res.json(rooms);
});

io.on("connection", (socket) => {
  console.log("user connected", socket.id);
});

server.listen(PORT, (err) => {
  if (err) {
    throw new Error("Something goes wrong:", err);
  }
  console.log(`Server Started on: http://127.0.0.1:${PORT}`);
});
