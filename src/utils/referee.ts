import { HandRanking, RANKS } from "@/constants/common";

function sortBySuit(a: string, b: string) {
  return a[1] > b[1] ? -1 : 1;
}

function sortByRank(a: string, b: string) {
  return RANKS.indexOf(a[0]) > RANKS.indexOf(b[0]) ? 1 : -1;
}

function referee(boardCards: string[], handCards: string[]): string | number[] {
  const cards = [...boardCards, ...handCards];
  const res: string | number[] = [];

  let handRank: HandRanking | undefined;
  cards.sort(sortBySuit);

  const suits = cards.map((item) => item[1]).join("");

  const match = suits.match(/(\w)\1+/ig);

  if (match?.some((item) => item.length === 5)) {
    handRank = HandRanking.Flush;
  }

  console.log(cards, handRank);
  cards.sort(sortByRank);
  console.log(cards);

  return res;
}

export default referee;
