import { Socket } from "socket.io-client";
import { User } from "./connection";

class Player {
  profile: User;

  socket: Socket;

  constructor(socket: Socket, profile: User) {
    this.profile = profile;
    this.socket = socket;
  }
}

export default Player;
