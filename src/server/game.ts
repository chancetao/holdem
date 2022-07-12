import { Server, Socket } from "socket.io";

import { GamePhase, PlayerStatus } from "../constants/common";

import Deck from "./deck";
import Player from "./player";
import Pot from "./pot";

export interface GameParams {
  phase: GamePhase
  turn: string
  sbBet: number
  sbId: string
  bbBet: number
  bbId: string
  boardCards: string[]
  pot: Pot
}
class Game {
  playersMap: Map<Socket, Player>;

  sbKey: Socket;

  sbBet: number;

  server: Server;

  deck: Deck;

  gameParams: GameParams;

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
    this.sbBet = sbBet;

    this.gameParams = {
      sbBet,
      bbBet: sbBet * 2,
      phase: GamePhase.PreFlop,
      sbId: "",
      bbId: "",
      turn: "",
      boardCards: [],
      pot: new Pot(),
    };

    Array.from(playersMap.keys()).forEach((socket) => {
      socket.on("check", (socketId) => {
        this.updateGame();
      });

      socket.on("call", (socketId) => {
        this.updateGame();
      });

      socket.on("fold", (socketId) => {
        const sock = Array.from(playersMap.keys()).find((item) => item.id === socketId);
        if (sock) {
          playersMap.set(sock, {
            ...playersMap.get(sock),
            status: PlayerStatus.Fold,
          } as Player);
        }

        this.updateGame();
      });

      socket.on("rise", (socketId) => {
        this.updateGame();
      });

      socket.on("allIn", (socketId) => {
        this.updateGame();
      });
    });

    this.initGame();
  }

  updateGame() {
    this.server.sockets.emit(
      "updateGame",
      Array.from(this.playersMap.values()),
      this.gameParams,
    );
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
        status: PlayerStatus.Playing,
      } as Player);
    });

    const sb = this.playersMap.get(this.sbKey) as Player;

    const bbKey = Player.getLeftPlayer(this.playersMap, sb.profile.id) as Socket;

    const bb = this.playersMap.get(bbKey) as Player;

    sb.bet = this.sbBet;
    sb.chips -= this.sbBet;
    sb.showCheck = false;

    bb.bet = this.sbBet * 2;
    bb.chips -= bb.bet;

    this.gameParams.sbId = sb.profile.id;
    this.gameParams.bbId = bb.profile.id;
    this.gameParams.phase = GamePhase.PreFlop;
    this.gameParams.turn = sb.profile.id;

    this.updateGame();
  }
}

export default Game;
