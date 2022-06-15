import { Server } from "socket.io";

import { SERVER_PORT } from "../constants/common";
import connect from "./connection";

const io = new Server(SERVER_PORT, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

connect(io);
