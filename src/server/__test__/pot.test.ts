import Player from "../player";
import Pot from "../pot";

const pot = new Pot();

const players = [
  {
    profile: { id: "A" },
    allIn: true,
    bet: 50,
  },
  {
    profile: { id: "B" },
    allIn: false,
    bet: 250,
  },
  {
    profile: { id: "C" },
    allIn: false,
    bet: 350,
  },
  {
    profile: { id: "D" },
    allIn: false,
    bet: 50,
  },
  {
    profile: { id: "E" },
    allIn: false,
    bet: 800,
  },
  {
    profile: { id: "F" },
    allIn: false,
    bet: 500,
  },
];

pot.allIn(players as Player[]);

test("test pot", () => {
  expect(pot.pots).toEqual([
    {
      amount: 300,
      players: ["A", "B", "C", "D", "E", "F"],
    },
    {
      amount: 1700,
      players: ["B", "C", "D", "E", "F"],
    },
  ]);
});
