import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { IMessage, PlayerProfile } from "../types/common";
import { PlayerStatus } from "../constants/common";

import Player from "./player";
import Deck from "./deck";
import Game from "./game";

const defaultUser: PlayerProfile = {
  id: randomUUID(),
  color: "white",
  name: "Dealer",
};

let messages = new Set<IMessage>();
const playersMap = new Map<Socket, Player>();

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
    this.io.sockets.emit("message", { msg, users: Array.from(playersMap.values()) });
  }

  getMessages() {
    messages.forEach((msg) => this.sendMessage(msg));
  }

  handleMessage(val: string) {
    const msg = {
      id: randomUUID(),
      player: playersMap.get(this.socket)?.profile || defaultUser,
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
    const player = playersMap.get(this.socket) as Player;

    switch (type) {
      case "getReady":
        playersMap.set(this.socket, {
          ...player,
          status: PlayerStatus.Ready,
        } as Player);
        this.socket.emit("received", type);
        break;
      default:
    }

    if (!Array.from(
      playersMap.values(),
    ).map((item) => item.status === PlayerStatus.Ready).includes(false)) {
      this.deck.shuffle();
      this.handleStartNextGround();
    }
  }

  handleStartNextGround() {
    Array.from(playersMap.entries()).forEach(([socket, value]) => {
      const handCards = this.deck.deal(2) as [string, string];
      this.io.to(socket.id).emit("deal", handCards);
      playersMap.set(socket, { ...value, handCards } as Player);
    });

    const game = new Game(
      playersMap,
      Array.from(playersMap.keys())[0],
      this.io,
      this.deck,
      2,
    );
  }

  connect() {
    const user = new Player();
    playersMap.set(this.socket, user);

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
      content: `${playersMap.get(this.socket)?.profile?.name} has left the table.`,
      time: Date.now(),
    };
    messages.add(msg);
    playersMap.delete(this.socket);

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
