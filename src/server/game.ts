import { Server, Socket } from "socket.io";

import Deck from "./deck";
import { GamePhase, PlayerStatus } from "@/constants/common";
import Player from "./player";

class Game {
  playersMap: Map<Socket, Player>;

  sb: Socket;

  sbBet: number;

  server: Server;

  deck: Deck;

  phase: GamePhase;

  turn: string;

  constructor(
    playersMap: Map<Socket, Player>,
    sb: Socket,
    server: Server,
    deck: Deck,
    sbBet: number,
  ) {
    this.playersMap = playersMap;
    this.sb = sb;
    this.server = server;
    this.deck = deck;
    this.phase = GamePhase.PreFlop;
    this.sbBet = sbBet;

    this.turn = "";

    this.initGame();
  }

  initGame() {
    Array.from(this.playersMap.keys()).forEach((item) => {
      this.playersMap.set(item, {
        ...this.playersMap.get(item),
        isBigBlind: false,
        isSmallBlind: false,
        status: PlayerStatus.Ready,
      } as Player);
    });

    const sb = this.playersMap.get(this.sb) as Player;
    const bb = sb?.leftPlayer(this.players) as Player;

    sb.isSmallBlind = true;
    sb.bet = this.smallBlindBet;

    bb.isBigBlind = true;
    bb.bet = this.smallBlindBet * 2;

    this.turn = sb.profile.id;

    this.players.forEach((_, index) => {
      this.players[index].turn = this.turn;
    });

    this.server.sockets.emit("init", this.players);
  }
}

export default Game;
