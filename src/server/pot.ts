import { IPlayer } from "@/types/common";

interface IPot {
  amount: number
  players: string[]
}

class Pot {
  pots: IPot[];

  constructor() {
    this.pots = [
      {
        amount: 0,
        players: [],
      },
    ];
  }

  bet(amount: number, playerId: string) {
    this.pots[0].amount += amount;

    if (!this.pots[0].players.includes(playerId)) {
      this.pots[0].players.push(playerId);
    }
  }

  allIn(players: IPlayer[]) {
    this.pots = [];
    const allInPlayers = players.filter((item) => item.allIn === true);
    const restPlayers = players.filter((item) => item.allIn !== true);
    allInPlayers.sort((a, b) => (a.det > b.det ? 1 : -1));

    for (let i = 0; i < allInPlayers.length; i += 1) {
      if (i === 0) {
        this.pots.push({
          amount: [...allInPlayers.slice(i), ...restPlayers].reduce((prev, curr) => {
            if (curr.det >= allInPlayers[i].det) {
              return prev + allInPlayers[i].det;
            }
            return prev + curr.det;
          }, 0),
          players: players.map((item) => item.profile.id),
        });
      } else {
        this.pots.push({
          amount: [...allInPlayers.slice(i), ...restPlayers].reduce((prev, curr) => {
            if (curr.det >= allInPlayers[i].det) {
              return prev + allInPlayers[i].det - allInPlayers[i - 1].det;
            }
            return prev + curr.det - allInPlayers[i - 1].det;
          }, 0),
          players: [...allInPlayers.slice(i), ...restPlayers].map((item) => item.profile.id),
        });
      }
    }

    this.pots.push({
      amount: restPlayers.reduce((prev, curr) => {
        if (curr.det >= allInPlayers[allInPlayers.length - 1].det) {
          return prev + (curr.det - allInPlayers[allInPlayers.length - 1].det);
        }
        return prev;
      }, 0),
      players: restPlayers.map((item) => item.profile.id),
    });
  }
}

export default Pot;
