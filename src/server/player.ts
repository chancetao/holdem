// import { Socket } from "socket.io";
import { PlayerStatus } from "../constants/common";
import { PlayerProfile } from "../types/common";

import generator from "../utils/generator";

class Player {
  readonly profile: PlayerProfile;

  isSmallBlind: boolean;

  isBigBlind: boolean;

  chips: number;

  handCards: [string, string] | [];

  status: PlayerStatus;

  det: number;

  allIn: boolean;

  constructor() {
    this.profile = generator.generatePlayerProfile();
    this.isBigBlind = false;
    this.isSmallBlind = false;
    this.allIn = false;
    this.chips = 1000;
    this.handCards = [];
    this.status = PlayerStatus.Waiting;

    this.det = 0;
  }
}

export default Player;
