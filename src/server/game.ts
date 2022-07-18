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
  maxBet: number
  pot: Pot
  starterId: string
  defaultStarterId: string
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
      maxBet: sbBet * 2,
      phase: GamePhase.PreFlop,
      sbId: "",
      bbId: "",
      turn: "",
      boardCards: [],
      pot: new Pot(),
      starterId: "",
      defaultStarterId: "",
    };

    Array.from(playersMap.keys()).forEach((socket) => {
      socket.on("check", () => {
        const nextKey = Player.getLeftPlayerKey(playersMap, socket.id);
        const next = playersMap.get(nextKey as Socket) as Player;

        if (next?.profile.id === this.gameParams.starterId) {
          this.nextGround();
          return;
        }

        this.gameParams = {
          ...this.gameParams,
          turn: next.profile.id,
        };

        this.updateGame();
      });

      socket.on("call", (bet) => {
        const player = playersMap.get(socket) as Player;

        const nextKey = Player.getLeftPlayerKey(playersMap, socket.id);
        const next = playersMap.get(nextKey as Socket) as Player;

        playersMap.set(socket, {
          ...player,
          bet: player.bet + bet,
          chips: player.chips - bet,
        } as Player);

        if (next?.profile.id === this.gameParams.starterId) {
          this.nextGround();
          return;
        }

        this.gameParams = {
          ...this.gameParams,
          turn: next.profile.id,
        };

        this.updateGame();
      });

      socket.on("fold", () => {
        playersMap.set(socket, {
          ...playersMap.get(socket),
          status: PlayerStatus.Fold,
        } as Player);

        this.updateGame();
      });

      socket.on("rise", (bet) => {
        const player = playersMap.get(socket) as Player;

        const nextKey = Player.getLeftPlayerKey(playersMap, socket.id);
        const next = playersMap.get(nextKey as Socket) as Player;

        playersMap.set(socket, {
          ...player,
          bet: player.bet + bet,
        });

        this.gameParams = {
          ...this.gameParams,
          maxBet: this.gameParams.maxBet + bet,
          starterId: player.profile.id,
          turn: next.profile.id,
        };

        this.updateGame();
      });

      socket.on("allIn", () => {
        this.updateGame();
      });
    });

    this.initGame();
  }

  nextGround() {
    switch (this.gameParams.phase) {
      case GamePhase.PreFlop:
        this.gameParams = {
          ...this.gameParams,
          turn: this.gameParams.starterId,
          boardCards: this.deck.deal(3),
          phase: GamePhase.Flop,
        };
        break;
      case GamePhase.Flop:
        this.gameParams = {
          ...this.gameParams,
          turn: this.gameParams.starterId,
          boardCards: this.gameParams.boardCards.concat(this.deck.deal(1)),
          phase: GamePhase.Turn,
        };
        break;
      case GamePhase.Turn:
        this.gameParams = {
          ...this.gameParams,
          turn: this.gameParams.starterId,
          boardCards: this.gameParams.boardCards.concat(this.deck.deal(1)),
          phase: GamePhase.River,
        };
        break;
      case GamePhase.River:
        this.gameParams = {
          ...this.gameParams,
          turn: this.gameParams.starterId,
          phase: GamePhase.River,
        };
        break;
      default:
    }

    this.updateGame();
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

    const bbKey = Player.getLeftPlayerKey(this.playersMap, this.sbKey.id) as Socket;

    const bb = this.playersMap.get(bbKey) as Player;

    this.playersMap.set(this.sbKey, {
      ...sb,
      bet: this.sbBet,
      chips: sb.chips - this.sbBet,
    });

    this.playersMap.set(bbKey, {
      ...bb,
      bet: this.sbBet * 2,
      chips: bb.chips - this.sbBet * 2,
    });

    const bbLeftKey = Player.getLeftPlayerKey(this.playersMap, bbKey.id);

    const starterId = this.playersMap
      .get((playerKeys.length > 2 ? bbLeftKey : bbKey) as Socket)?.profile.id as string;

    this.gameParams = {
      ...this.gameParams,
      starterId,
      sbId: sb.profile.id,
      bbId: bb.profile.id,
      phase: GamePhase.PreFlop,
      turn: starterId,
      maxBet: this.sbBet * 2,
      defaultStarterId: starterId,
    };

    this.updateGame();
  }
}

export default Game;
