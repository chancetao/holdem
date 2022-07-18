import { Socket } from "socket.io";
import { PlayerStatus } from "../constants/common";
import { PlayerProfile } from "../types/common";

import generator from "../utils/generator";

class Player {
  profile: PlayerProfile;

  chips: number;

  handCards: [string, string] | [];

  status: PlayerStatus;

  bet: number;

  allIn: boolean;

  constructor() {
    this.profile = generator.generatePlayerProfile();
    this.allIn = false;
    this.chips = 1000;
    this.handCards = [];
    this.status = PlayerStatus.Waiting;

    this.bet = 0;
  }

  static getLeftPlayerKey(players: Map<Socket, Player>, socketId: string) {
    const keys = Array.from(players.keys());
    const values = Array.from(players.values());
    if (values.length <= 1) {
      return null;
    }
    const index = keys.findIndex((item) => item.id === socketId);
    if (index === 0) {
      return keys[keys.length - 1];
    }
    return keys[index - 1];
  }

  static getRightPlayer(players: Map<Socket, Player>, socketId: string) {
    const keys = Array.from(players.keys());
    const values = Array.from(players.values());
    if (values.length <= 1) {
      return null;
    }
    const index = keys.findIndex((item) => item.id === socketId);
    if (index === keys.length - 1) {
      return keys[0];
    }
    return keys[index + 1];
  }
}

export default Player;
