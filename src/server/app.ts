import { Server } from "socket.io";

import { SERVER_PORT } from "../constants/common";
import chat from "./chat";

const io = new Server(SERVER_PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

chat(io);
