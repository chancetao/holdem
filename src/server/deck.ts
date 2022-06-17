import { CARDS } from "../constants/common";

class Deck {
  cards: string[];

  nextCard: number;

  constructor() {
    this.nextCard = 0;
    this.cards = [...CARDS];
  }

  shuffle() {
    this.nextCard = 0;
    const shuffleDeck: string[] = [];
    for (let i = 0; i < 52; i += 1) {
      shuffleDeck.push(
        this.cards.splice(Math.floor(Math.random() * this.cards.length), 1)[0],
      );
    }
    this.cards = shuffleDeck;
  }

  deal(num: number): string[] {
    const dealtCards = [];
    for (let i = 0; i < num && this.nextCard < 52; i += 1) {
      dealtCards.push(this.cards[this.nextCard]);
      this.nextCard += 1;
    }
    return dealtCards;
  }
}

export default Deck;
