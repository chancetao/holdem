import { HandRanking, HandRankingText, RANKS } from "../constants/common";

function sortBySuit(a: string, b: string) {
  return a[1] > b[1] ? -1 : 1;
}

function sortByRank(a: string, b: string) {
  return RANKS.indexOf(a[0]) > RANKS.indexOf(b[0]) ? 1 : -1;
}

function referee(boardCards: string[], handCards: string[]): string | number[] {
  const cards = [...boardCards, ...handCards];
  const res: string | number[] = [];

  const reg = /(\w)\1+/ig;

  cards.sort(sortByRank);
  const ranks = cards.map((item) => item[0]).join("");
  const rankMatch = ranks.match(reg);

  const minusPrevRanks = ranks.split("")
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .map((item, index, arr) => {
      if (index <= arr.length - 2) {
        return RANKS.indexOf(arr[index + 1]) - RANKS.indexOf(item);
      }
      return item;
    });

  console.log("minusPreRanks", minusPrevRanks);

  if (rankMatch?.some((item) => item.length === 2)) {
    res[0] = HandRanking.OnePair;
    if (rankMatch.length >= 2) {
      res[0] = HandRanking.TwoPairs;
    }
  }

  if (rankMatch?.some((item) => item.length === 3)) {
    res[0] = HandRanking.ThreeOfAKind;
    if (rankMatch?.some((item) => item.length === 2)) {
      res[0] = HandRanking.FullHouse;
    }
  }

  if (minusPrevRanks.join("").includes("1111")) {
    if (!(res[0] > HandRanking.Straight)) {
      res[0] = HandRanking.Straight;
    }
  }

  if (rankMatch?.some((item) => item.length === 4)) {
    res[0] = HandRanking.FourOfAKind;
  }

  cards.sort(sortBySuit);
  const suits = cards.map((item) => item[1]).join("");
  const suitMatch = suits.match(/(\w)\1+/ig);

  if (suitMatch?.some((item) => item.length === 5)) {
    if (!(res[0] > HandRanking.Flush)) {
      res[0] = HandRanking.Flush;
    }
  }

  if (!rankMatch && !res[0]) {
    res[0] = HandRanking.HighCard;
  }

  console.log(cards, HandRankingText[res[0] as HandRanking]);

  return res;
}

export default referee;
