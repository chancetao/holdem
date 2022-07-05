export const SERVER_PORT = 9999;

export const CLIENT_PORT = 3000;

export const COLORS = [
  "#619AFF",
  "#47DAD7",
  "#FEAC00",
  "#FE7490",
  "#406C85",
  "#946DFF",
  "#FF4500",
  "#6DC8EC",
  "#4435FF",
  "#1AAF8B",
];

export const SUITS = ["spade", "heart", "diamond", "club"];

export const RANKS = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K", "A"];

export const CARDS = [
  "As", "Ah", "Ad", "Ac",
  "Ks", "Kh", "Kd", "Kc",
  "Qs", "Qh", "Qd", "Qc",
  "Js", "Jh", "Jd", "Jc",
  "Ts", "Th", "Td", "Tc",
  "9s", "9h", "9d", "9c",
  "8s", "8h", "8d", "8c",
  "7s", "7h", "7d", "7c",
  "6s", "6h", "6d", "6c",
  "5s", "5h", "5d", "5c",
  "4s", "4h", "4d", "4c",
  "3s", "3h", "3d", "3c",
  "2s", "2h", "2d", "2c",
];

export enum HandRanking {
  HighCard,
  OnePair,
  TwoPairs,
  ThreeOfAKind,
  Straight,
  Flush,
  FullHouse,
  FourOfAKind,
  StraightFlush,
  RoyalStraightFlush,
}

export const HandRankingText = {
  [HandRanking.HighCard]: "High card",
  [HandRanking.OnePair]: "One pair",
  [HandRanking.TwoPairs]: "Two pairs",
  [HandRanking.ThreeOfAKind]: "Three of a kind",
  [HandRanking.Straight]: "Straight",
  [HandRanking.Flush]: "Flush",
  [HandRanking.FullHouse]: "Full house",
  [HandRanking.FourOfAKind]: "Four of a kind",
  [HandRanking.StraightFlush]: "Straight flush",
  [HandRanking.RoyalStraightFlush]: "Royal straight flush",
};

export enum PlayerStatus {
  Waiting = "Waiting",
  Ready = "Ready",
  Playing = "Playing",
  Fold = "Fold",
}
