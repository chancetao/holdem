// import { Socket } from "socket.io";
import { PlayerProfile } from "../types/common";

import generator from "../utils/generator";

class Player {
  readonly profile: PlayerProfile;

  // ready to start new round
  ready: boolean;

  isSmallBlind: boolean;

  isBigBlind: boolean;

  allIn: boolean;

  chips: number;

  handCards: [string, string] | [];

  constructor() {
    this.profile = generator.generatePlayerProfile();
    this.ready = false;
    this.isBigBlind = false;
    this.isSmallBlind = false;
    this.allIn = false;
    this.chips = 1000;
    this.handCards = [];
  }
}

export default Player;
