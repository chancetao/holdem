import { Server } from "socket.io";

import { SERVER_PORT, CLIENT_PORT } from "../constants/common";

const io = new Server(SERVER_PORT, {
  cors: {
    origin: `http://localhost:${CLIENT_PORT}`,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.emit("hello", 123);

  socket.on("howdy", (arg) => {
    console.log(arg);
  });
});
