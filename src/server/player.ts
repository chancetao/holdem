// import { Socket } from "socket.io";
import { Socket } from "socket.io";
import { PlayerStatus } from "../constants/common";
import { PlayerProfile } from "../types/common";

import generator from "../utils/generator";

class Player {
  profile: PlayerProfile;

  isSmallBlind: boolean;

  isBigBlind: boolean;

  chips: number;

  handCards: [string, string] | [];

  status: PlayerStatus;

  bet: number;

  allIn: boolean;

  turn: string;

  showCheck: boolean;

  showCall: boolean;

  constructor() {
    this.profile = generator.generatePlayerProfile();
    this.isBigBlind = false;
    this.isSmallBlind = false;
    this.allIn = false;
    this.chips = 1000;
    this.handCards = [];
    this.status = PlayerStatus.Waiting;

    this.bet = 0;
    this.turn = "";
    this.showCheck = true;
    this.showCall = true;
  }

  static getLeftPlayer(players: Map<Socket, Player>, id: string) {
    const keys = Array.from(players.keys());
    const values = Array.from(players.values());
    if (values.length <= 1) {
      return null;
    }
    const index = values.findIndex((item) => item.profile.id === id);
    if (index === 0) {
      return keys[keys.length - 1];
    }
    return keys[index - 1];
  }

  static getRightPlayer(players: Map<Socket, Player>, id: string) {
    const keys = Array.from(players.keys());
    const values = Array.from(players.values());
    if (values.length <= 1) {
      return null;
    }
    const index = values.findIndex((item) => item.profile.id === id);
    if (index === keys.length - 1) {
      return keys[0];
    }
    return keys[index + 1];
  }
}

export default Player;
