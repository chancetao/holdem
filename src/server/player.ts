// import { Socket } from "socket.io";
import { PlayerStatus } from "../constants/common";
import { PlayerProfile } from "../types/common";

import generator from "../utils/generator";

class Player {
  readonly profile: PlayerProfile;

  isSmallBlind: boolean;

  isBigBlind: boolean;

  allIn: boolean;

  chips: number;

  handCards: [string, string] | [];

  status: PlayerStatus;

  constructor() {
    this.profile = generator.generatePlayerProfile();
    this.isBigBlind = false;
    this.isSmallBlind = false;
    this.allIn = false;
    this.chips = 1000;
    this.handCards = [];
    this.status = PlayerStatus.Waiting;
  }
}

export default Player;
