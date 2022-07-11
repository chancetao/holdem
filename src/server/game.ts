import { Server, Socket } from "socket.io";

import { GamePhase, PlayerStatus } from "../constants/common";

import Deck from "./deck";
import Player from "./player";

class Game {
  playersMap: Map<Socket, Player>;

  sbKey: Socket;

  sbBet: number;

  server: Server;

  deck: Deck;

  phase: GamePhase;

  turn: string;

  constructor(
    playersMap: Map<Socket, Player>,
    sbKey: Socket,
    server: Server,
    deck: Deck,
    sbBet: number,
  ) {
    this.playersMap = playersMap;
    this.sbKey = sbKey;
    this.server = server;
    this.deck = deck;
    this.phase = GamePhase.PreFlop;
    this.sbBet = sbBet;

    this.turn = "";

    this.initGame();
  }

  initGame() {
    const playerKeys = Array.from(this.playersMap.keys());

    if (playerKeys.length <= 1) {
      return;
    }

    playerKeys.forEach((item) => {
      this.playersMap.set(item, {
        ...this.playersMap.get(item),
        isBigBlind: false,
        isSmallBlind: false,
        status: PlayerStatus.Ready,
      } as Player);
    });

    const sb = this.playersMap.get(this.sbKey) as Player;

    const bbKey = Player.getLeftPlayer(this.playersMap, sb.profile.id) as Socket;

    const bb = this.playersMap.get(bbKey) as Player;

    sb.isSmallBlind = true;
    sb.bet = this.sbBet;
    sb.chips -= this.sbBet;

    bb.isBigBlind = true;
    bb.bet = this.sbBet * 2;
    bb.chips -= bb.bet;

    this.turn = sb.profile.id;

    playerKeys.forEach((item) => {
      this.playersMap.set(item, {
        ...this.playersMap.get(item),
        turn: this.turn,
      } as Player);
    });

    this.server.sockets.emit("initGame", Array.from(this.playersMap.values()));
  }
}

export default Game;
