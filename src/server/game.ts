import { Server } from "socket.io";
import { IPlayer } from "@/types/common";

import Deck from "./deck";
import { PlayerStatus } from "@/constants/common";

class Game {
  players: IPlayer[];

  starter: number;

  server: Server;

  deck: Deck;

  constructor(players: IPlayer[], starter: number, server: Server, deck: Deck) {
    this.players = players;
    this.starter = starter;
    this.server = server;
    this.deck = deck;
  }

  init() {
    this.players.forEach((item) => item.status === PlayerStatus.Playing);
  }
}

export default Game;
