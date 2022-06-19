import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { IMessage, IPlayer, PlayerProfile } from "../types/common";

import Player from "./player";
import Deck from "./deck";

const defaultUser: PlayerProfile = {
  id: randomUUID(),
  color: "white",
  name: "Dealer",
};

let messages = new Set<IMessage>();
const players = new Map<Socket, IPlayer>();

class Connection {
  socket: Socket;

  io: Server;

  deck: Deck;

  constructor(io: Server, socket: Socket) {
    this.socket = socket;
    this.io = io;

    this.deck = new Deck();

    socket.on("getMessages", () => this.getMessages());
    socket.on("message", (value) => this.handleMessage(value));
    socket.on("sitDown", () => this.connect());
    socket.on("getReady", () => this.handleReceived("getReady"));
    socket.on("disconnect", () => this.disconnect());
    socket.on("connect_error", (err) => {
      // eslint-disable-next-line no-console
      console.log(`connect_error due to ${err.message}`);
    });
  }

  sendMessage(msg: IMessage) {
    this.io.sockets.emit("message", { msg, users: Array.from(players.values()) });
  }

  getMessages() {
    messages.forEach((msg) => this.sendMessage(msg));
  }

  handleMessage(val: string) {
    const msg = {
      id: randomUUID(),
      player: players.get(this.socket)?.profile || defaultUser,
      content: val,
      time: Date.now(),
    };

    messages.add(msg);

    if (messages.size >= 200) {
      messages = new Set(Array.from(messages).slice(1));
    }

    this.sendMessage(msg);
  }

  handleReceived(type: string) {
    const player = players.get(this.socket) as IPlayer;

    switch (type) {
      case "getReady":
        players.set(this.socket, {
          ...player,
          ready: true,
        });
        this.socket.emit("received", type);
        break;
      default:
    }

    if (!Array.from(players.values()).map((item) => item.ready).includes(false)) {
      this.deck.shuffle();
      this.handleStartNextGround();
    }
  }

  handleStartNextGround() {
    Array.from(players.entries()).forEach(([socket, value]) => {
      const handCards = this.deck.deal(2) as [string, string];
      this.io.to(socket.id).emit("deal", handCards);
      players.set(socket, { ...value, handCards });
    });
  }

  connect() {
    const user: IPlayer = new Player();
    players.set(this.socket, user);

    this.socket.emit("identify", user);

    const msg = {
      id: randomUUID(),
      player: defaultUser,
      content: `${user.profile?.name} sat down.`,
      time: Date.now(),
    };
    messages.add(msg);
    this.sendMessage(msg);
  }

  disconnect() {
    const msg = {
      id: randomUUID(),
      player: defaultUser,
      content: `${players.get(this.socket)?.profile?.name} has left the table.`,
      time: Date.now(),
    };
    messages.add(msg);
    players.delete(this.socket);

    this.sendMessage(msg);
  }
}

function connect(io: Server) {
  io.on("connection", (socket) => {
    const connection = new Connection(io, socket);
    return connection;
  });
}

export default connect;
