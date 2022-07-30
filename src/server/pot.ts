import Player from "./player";

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

  bet(players: Player[]) {
    players.forEach((item) => {
      if (item.bet > 0) {
        this.pots[0].amount += item.bet;

        if (!this.pots[0].players.includes(item.profile.id)) {
          this.pots[0].players.push(item.profile.id);
        }
      }
    });
  }

  allIn(players: Player[]) {
    this.pots = [];
    const allInPlayers = players.filter((item) => item.allIn === true);
    const restPlayers = players.filter((item) => item.allIn !== true);
    allInPlayers.sort((a, b) => (a.bet > b.bet ? 1 : -1));

    for (let i = 0; i < allInPlayers.length; i += 1) {
      if (i === 0) {
        this.pots.push({
          amount: [...allInPlayers.slice(i), ...restPlayers].reduce((prev, curr) => {
            if (curr.bet >= allInPlayers[i].bet) {
              return prev + allInPlayers[i].bet;
            }
            return prev + curr.bet;
          }, 0),
          players: players.map((item) => item.profile.id),
        });
      } else {
        this.pots.push({
          amount: [...allInPlayers.slice(i), ...restPlayers].reduce((prev, curr) => {
            if (curr.bet >= allInPlayers[i].bet) {
              return prev + allInPlayers[i].bet - allInPlayers[i - 1].bet;
            } if (curr.bet >= allInPlayers[i - 1].bet) {
              return prev + curr.bet - allInPlayers[i - 1].bet;
            }
            return prev;
          }, 0),
          players: [...allInPlayers.slice(i), ...restPlayers].map((item) => item.profile.id),
        });
      }
    }

    this.pots.push({
      amount: restPlayers.reduce((prev, curr) => {
        if (curr.bet >= allInPlayers[allInPlayers.length - 1].bet) {
          return prev + (curr.bet - allInPlayers[allInPlayers.length - 1].bet);
        }
        return prev;
      }, 0),
      players: restPlayers.map((item) => item.profile.id),
    });
  }
}

export default Pot;
