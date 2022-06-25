import { HandRanking } from "../../constants/common";
import referee from "../referee";

test("test referee", () => {
  // expect(referee(["6s", "Js", "3h", "Qh", "Kh", "5d", "Ad"]))
  //   .toEqual([HandRanking.HighCard, "A", "K", "Q", "J", "6"]);

  // expect(referee(["Qs", "As", "2h", "Td", "Jd", "Ad", "6c"]))
  //   .toEqual([HandRanking.OnePair]);

  // expect(referee(["5s", "7s", "2d", "3d", "4d", "7d", "3c"]))
  //   .toEqual([HandRanking.TwoPairs]);

  expect(referee(["5s", "2s", "2d", "3d", "2c", "7d", "6c"]))
    .toEqual({ hand: HandRanking.ThreeOfAKind, cards: ["2s", "2d", "2c", "7d", "6c"], weight: "3aaafe" });

  expect(referee(["As", "2s", "3h", "4h", "Kh", "5d", "Qd"]))
    .toEqual({ cards: ["As", "2s", "3h", "4h", "5d"], hand: HandRanking.Straight, weight: "4d" });

  expect(referee(["6s", "2s", "2h", "3h", "4h", "5d", "Qd"]))
    .toEqual({ cards: ["2s", "3h", "4h", "5d", "6s"], hand: HandRanking.Straight, weight: "4e" });

  expect(referee(["2c", "2s", "3h", "3s", "4h", "6d", "5d"]))
    .toEqual({ cards: ["2s", "3s", "4h", "5d", "6d"], hand: 4, weight: "4e" });

  // expect(referee(["5h", "2s", "3h", "4h", "Kh", "5d", "Qh"]))
  //   .toEqual([HandRanking.Flush]);

  // expect(referee(["Ah", "2s", "Ad", "4h", "As", "4d", "Qh"]))
  //   .toEqual([HandRanking.FullHouse]);

  // expect(referee(["Kh", "2s", "3h", "Ks", "Kc", "Kd", "Qh"]))
  //   .toEqual([HandRanking.FourOfAKind]);

  // expect(referee(["5d", "2d", "3d", "4d", "Kh", "6d", "Qh"]))
  //   .toEqual([HandRanking.StraightFlush]);

  // expect(referee(["5d", "2d", "3d", "4d", "Kh", "Ad", "Qh"]))
  //   .toEqual([HandRanking.StraightFlush]);

  // expect(referee(["As", "Js", "Ts", "Qs", "Ks", "5d", "Qd"]))
  //   .toEqual([HandRanking.RoyalStraightFlush]);
});
