// import { Socket } from "socket.io";
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
  }

  leftPlayer(players: Player[]) {
    if (players.length <= 1) {
      return null;
    }
    const index = players.findIndex((item) => item.profile.id === this.profile.id);
    if (index === 0) {
      return players[players.length - 1];
    }
    return players[index - 1];
  }

  rightPlayer(players: Player[]) {
    if (players.length <= 1) {
      return null;
    }
    const index = players.findIndex((item) => item.profile.id === this.profile.id);
    if (index === players.length - 1) {
      return players[0];
    }
    return players[index + 1];
  }
}

export default Player;
