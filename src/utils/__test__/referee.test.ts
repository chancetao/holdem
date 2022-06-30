import referee from "../referee";

test("test referee", () => {
  expect(referee(["6s", "Js", "3h", "Qh", "Kh", "5d", "Ad"]))
    .toEqual({ cards: ["Ad", "Kh", "Qh", "Js", "6s"], rank: 0, weight: "0mlkje" });

  expect(referee(["Qs", "As", "2h", "Td", "Jd", "Ad", "6c"]))
    .toEqual({ cards: ["As", "Ad", "Qs", "Jd", "Td"], rank: 1, weight: "1mmkji" });

  expect(referee(["5s", "7s", "2d", "3d", "4d", "7d", "3c"]))
    .toEqual({ cards: ["7s", "7d", "3d", "3c", "5s"], rank: 2, weight: "2ffbbd" });

  expect(referee(["5s", "2s", "2d", "3d", "2c", "7d", "6c"]))
    .toEqual({ rank: 3, cards: ["2s", "2d", "2c", "7d", "6c"], weight: "3aaafe" });

  expect(referee(["As", "2s", "3h", "4h", "Kh", "5d", "Qd"]))
    .toEqual({ cards: ["As", "2s", "3h", "4h", "5d"], rank: 4, weight: "4d" });

  expect(referee(["6s", "2s", "2h", "3h", "4h", "5d", "Qd"]))
    .toEqual({ cards: ["2s", "3h", "4h", "5d", "6s"], rank: 4, weight: "4e" });

  expect(referee(["2c", "2s", "3h", "3s", "4h", "6d", "5d"]))
    .toEqual({ cards: ["2s", "3s", "4h", "5d", "6d"], rank: 4, weight: "4e" });

  expect(referee(["5h", "Qs", "3h", "4h", "Kh", "Kd", "Qh"]))
    .toEqual({ cards: ["Kh", "Qh", "5h", "4h", "3h"], rank: 5, weight: "5lkdcb" });

  expect(referee(["Ah", "2s", "Ad", "4h", "As", "4d", "2h"]))
    .toEqual({ cards: ["As", "Ah", "Ad", "4h", "4d"], rank: 6, weight: "6mmmcc" });

  expect(referee(["Kh", "2s", "4h", "Ks", "Kc", "Kd", "Qh"]))
    .toEqual({ cards: ["Ks", "Kh", "Kd", "Kc", "Qh"], rank: 7, weight: "7llllk" });

  expect(referee(["5d", "2d", "3d", "4d", "Kh", "6d", "Qh"]))
    .toEqual({ cards: ["2d", "3d", "4d", "5d", "6d"], rank: 8, weight: "8e" });

  expect(referee(["As", "Js", "Ts", "Qs", "Ks", "5d", "Qd"]))
    .toEqual({ cards: ["Ts", "Js", "Qs", "Ks", "As"], rank: 9, weight: "9" });
});
