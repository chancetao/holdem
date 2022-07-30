import { HandRanking, RANKS } from "../constants/common";

export interface RefereeValue {
  rank: HandRanking
  cards: string[]
  weight: string
}

const reg = /(\w)\1+/ig;

function sortBySuit(a: string, b: string) {
  return a[1] > b[1] ? -1 : 1;
}

function sortByRank(a: string, b: string) {
  return RANKS.indexOf(a[0]) > RANKS.indexOf(b[0]) ? 1 : -1;
}

// get the difference between two adjacent items in the array
function getMinusPreRanks(cards: string[]): (string | number)[] {
  const ranks = cards.map((item) => item[0]);

  const res = ranks
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .map((item, index, arr) => {
      if (index <= arr.length - 2) {
        return RANKS.indexOf(arr[index + 1]) - RANKS.indexOf(item);
      }
      return item;
    });

  return res;
}

function isStraightFlush(cards: string[], suitMatch: string[]): HandRanking {
  const suit = suitMatch.filter((item) => item.length >= 5)[0][0];
  const sameSuitCards = cards.filter((item) => item[1] === suit);

  let res = HandRanking.Flush;

  sameSuitCards.sort(sortByRank);

  const ranks = sameSuitCards.map((item) => item[0]);
  const minusPrevRanks = getMinusPreRanks(sameSuitCards);

  if (minusPrevRanks.join("").includes("1111")
    || (ranks.join("").includes("2345") && ranks.at(-1) === "A")) {
    res = HandRanking.StraightFlush;

    if (ranks.join("").includes("TJQKA")) {
      res = HandRanking.RoyalStraightFlush;
    }
  }

  return res;
}

function getRank(cards: string[]): number {
  let res: HandRanking = 0;

  cards.sort(sortByRank);
  const ranks = cards.map((item) => item[0]).join("");
  const rankMatch = ranks.match(reg);

  const minusPrevRanks = getMinusPreRanks(cards);

  if (rankMatch?.some((item) => item.length === 2)) {
    res = HandRanking.OnePair;
    if (rankMatch.length >= 2) {
      res = HandRanking.TwoPairs;
    }
  }

  if (rankMatch?.some((item) => item.length === 3)) {
    res = HandRanking.ThreeOfAKind;
    if (rankMatch?.some((item) => item.length === 2)) {
      res = HandRanking.FullHouse;
    }
  }

  if (minusPrevRanks.join("").includes("1111")
    || (ranks.includes("2345") && ranks.at(-1) === "A")) {
    if (!(res > HandRanking.Straight)) {
      res = HandRanking.Straight;
    }
  }

  if (rankMatch?.some((item) => item.length === 4)) {
    res = HandRanking.FourOfAKind;
  }

  cards.sort(sortBySuit);
  const suits = cards.map((item) => item[1]).join("");
  const suitMatch = suits.match(/(\w)\1+/ig);

  if (suitMatch?.some((item) => item.length >= 5)) {
    if (!(res > HandRanking.Flush)) {
      res = isStraightFlush(cards, suitMatch);
    }
  }

  if (!rankMatch && !res) {
    res = HandRanking.HighCard;
  }

  return res;
}

function getWeight(cards: string[]): string {
  return cards
    .map((item) => String.fromCharCode("a".charCodeAt(0) + RANKS.indexOf(item[0])))
    .join("");
}

function handleHighCard(sources: string[]): Omit<RefereeValue, "rank"> {
  const ranks = [...sources].sort(sortByRank);

  const cards = ranks.reverse().slice(0, 5);
  const weight = getWeight(cards);

  return { cards, weight: `${HandRanking.HighCard}${weight}` };
}

function handleOnePair(sources: string[]): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank);
  const target = (sortedSources.map((item) => item[0]).join("").match(reg) as string[])[0][0];

  const pair = sources.filter((item) => item[0] === target);
  const rest = sources.filter((item) => item[0] !== target);

  rest.sort(sortByRank).reverse();

  const cards = [...pair, ...rest.slice(0, 3)];
  const weight = getWeight(cards);

  return { cards, weight: `${HandRanking.OnePair}${weight}` };
}

function handleTwoPairs(sources: string[]): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank).reverse();
  const target = (sortedSources.map((item) => item[0]).join("").match(reg) as string[]);

  target.sort(sortByRank).reverse();

  const bigPair = sortedSources.filter((item) => item.includes(target[0][0]));
  const smallPair = sortedSources.filter((item) => item.includes(target[1][0]));

  const rest = sortedSources.filter((item) => !([...bigPair, ...smallPair].includes(item)));

  const cards = [...bigPair, ...smallPair, rest[0]];
  const weight = getWeight(cards);

  return { cards, weight: `${HandRanking.TwoPairs}${weight}` };
}

function handleThreeOfAKind(sources: string[]): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank).reverse();

  const target = (sortedSources.map((item) => item[0]).join("").match(reg) as string[]);

  const rest = sortedSources.filter((item) => !item.includes(target[0][0]));
  const three = sortedSources.filter((item) => item.includes(target[0][0]));

  const cards = [...three, ...rest.slice(0, 2)];
  const weight = getWeight(cards);

  return { cards, weight: `${HandRanking.ThreeOfAKind}${weight}` };
}

function handleStraight(sources: string[], rank?: HandRanking): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank);
  const minusPrevRanks = getMinusPreRanks(sortedSources).join("");

  const filteredSources = sortedSources
    .map((item) => item[0])
    .filter((item, index, arr) => arr.indexOf(item) === index)
    .join("");

  const cards: string[] = [];
  let weight = "";

  if (!minusPrevRanks.includes("1111")) {
    weight = getWeight(["5"]);
    cards.push(sources.find((item) => item[0] === "A") as string);

    for (let i = 0; i < 4; i += 1) {
      cards.push((sources.find((item) => item[0] === RANKS[i]) as string));
    }
  } else {
    const index = minusPrevRanks.lastIndexOf("1111");
    const straightValue = filteredSources[index + 4];

    weight = getWeight([straightValue]);

    for (let i = 4; i >= 0; i -= 1) {
      cards.push(
        (sources.find((item) => item[0] === RANKS[RANKS.indexOf(straightValue) - i]) as string),
      );
    }
  }

  return { cards, weight: `${rank || HandRanking.Straight}${weight}` };
}

function handleFlush(sources: string[]): Omit<RefereeValue, "rank"> {
  const suits = sources.map((item) => item[1]).join("");
  const suitMatch = suits.match(/(\w)\1+/ig)?.filter((item) => item.length >= 5);

  const cards = sources.filter((item) => item[1] === (suitMatch as string[])[0][0]).slice(0, 5);
  cards.sort(sortByRank).reverse();

  return { cards, weight: `${HandRanking.Flush}${getWeight(cards)}` };
}

function handleFullHouse(sources: string[]): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank).reverse();

  const ranks = sortedSources.map((item) => item[0]).join("");
  const rankMatch = ranks.match(reg);

  const three = rankMatch?.find((item) => item.length === 3);
  const two = rankMatch?.find((item) => item.length === 2);

  const cards = [];

  cards.push(...sources.filter((item) => item[0] === (three as string)[0]));
  cards.push(...sources.filter((item) => item[0] === (two as string)[0]));

  return { cards, weight: `${HandRanking.FullHouse}${getWeight(cards)}` };
}

function handleFourOfAKind(sources: string[]): Omit<RefereeValue, "rank"> {
  const sortedSources = [...sources].sort(sortByRank).reverse();

  const ranks = sortedSources.map((item) => item[0]).join("");
  const rankMatch = ranks.match(reg);

  const four = rankMatch?.find((item) => item.length === 4);
  const rest = sortedSources.filter((item) => item[0] !== (four as string)[0]);

  const cards = sortedSources.filter((item) => item[0] === (four as string)[0]).concat(rest[0]);

  return { cards, weight: `${HandRanking.FourOfAKind}${getWeight(cards)}` };
}

function handleStraightFlush(sources: string[]): Omit<RefereeValue, "rank"> {
  const suits = sources.map((item) => item[1]).join("");
  const suitMatch = suits.match(/(\w)\1+/ig)?.filter((item) => item.length >= 5);
  const cards = sources.filter((item) => item[1] === (suitMatch as string[])[0][0]);

  return handleStraight(cards, HandRanking.StraightFlush);
}

function handleRoyalStraightFlush(sources: string[]): Omit<RefereeValue, "rank"> {
  const suits = sources.map((item) => item[1]).join("");
  const suitMatch = suits.match(/(\w)\1+/ig)?.filter((item) => item.length >= 5);

  const ranks = RANKS.slice(8);
  const cards = ranks.map((item) => `${item}${(suitMatch as string[])[0][0]}`);

  return { cards, weight: `${HandRanking.RoyalStraightFlush}` };
}

function getValues(cards: string[], rank: HandRanking): Omit<RefereeValue, "rank"> {
  let values: Omit<RefereeValue, "rank"> = { cards: [], weight: "" };

  switch (rank) {
    case HandRanking.HighCard:
      values = handleHighCard(cards);
      break;
    case HandRanking.OnePair:
      values = handleOnePair(cards);
      break;
    case HandRanking.TwoPairs:
      values = handleTwoPairs(cards);
      break;
    case HandRanking.ThreeOfAKind:
      values = handleThreeOfAKind(cards);
      break;
    case HandRanking.Straight:
      values = handleStraight(cards);
      break;
    case HandRanking.Flush:
      values = handleFlush(cards);
      break;
    case HandRanking.FullHouse:
      values = handleFullHouse(cards);
      break;
    case HandRanking.FourOfAKind:
      values = handleFourOfAKind(cards);
      break;
    case HandRanking.StraightFlush:
      values = handleStraightFlush(cards);
      break;
    case HandRanking.RoyalStraightFlush:
      values = handleRoyalStraightFlush(cards);
      break;
    default:
  }

  return values;
}

function referee(cards: string[]): RefereeValue | null {
  if (cards?.length < 5) {
    return null;
  }
  const rank = getRank(cards);
  const res = getValues(cards, rank);

  return {
    rank,
    ...res,
  };
}

export default referee;
