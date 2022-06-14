import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";

import { COLORS, NAMES } from "../constants/common";

export interface User {
  id: string
  color: string
  name: string
  avatar?: string
}

export interface Message {
  id: string
  user: User
  content: string
  time: number
}

const defaultUser: User = {
  id: randomUUID(),
  color: "white",
  name: "Dealer",
};

let messages = new Set<Message>();
const users = new Map<Socket, User>();

class Connection {
  socket: Socket;

  io: Server;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    socket.on("getMessages", () => this.getMessages());
    socket.on("message", (value) => this.handleMessage(value));
    socket.on("sit_down", () => this.connect());
    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      // eslint-disable-next-line no-console
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(msg: Message) {
    this.io.sockets.emit("message", { msg, users: Array.from(users.values()) });
  }

  getMessages() {
    messages.forEach((msg) => this.sendMessage(msg));
  }

  handleMessage(val: string) {
    const msg = {
      id: randomUUID(),
      user: users.get(this.socket) || defaultUser,
      content: val,
      time: Date.now(),
    };

    messages.add(msg);

    if (messages.size >= 200) {
      messages = new Set(Array.from(messages).slice(1));
    }

    this.sendMessage(msg);
  }

  connect() {
    const user: User = {
      id: randomUUID(),
      color: COLORS[Math.floor(Math.random() * 10)],
      name: NAMES[Math.floor(Math.random() * 10)],
    };
    users.set(this.socket, user);

    this.socket.emit("identify", user);

    const msg = {
      id: randomUUID(),
      user: defaultUser,
      content: `${user.name} sat down.`,
      time: Date.now(),
    };
    messages.add(msg);
    this.sendMessage(msg);
  }

  disconnect() {
    const msg = {
      id: randomUUID(),
      user: defaultUser,
      content: `${users.get(this.socket)?.name} has left the table.`,
      time: Date.now(),
    };
    messages.add(msg);
    users.delete(this.socket);

    this.sendMessage(msg);
  }
}

function chat(io: Server) {
  io.on("connection", (socket) => {
    const connection = new Connection(io, socket);
    return connection;
  });
}

export default chat;
