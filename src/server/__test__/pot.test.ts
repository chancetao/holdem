import { IPlayer } from "@/types/common";
import Pot from "../pot";

const pot = new Pot();

const players = [
  {
    profile: { id: "A" },
    allIn: true,
    det: 50,
  },
  {
    profile: { id: "B" },
    allIn: true,
    det: 250,
  },
  {
    profile: { id: "C" },
    allIn: true,
    det: 350,
  },
  {
    profile: { id: "D" },
    allIn: false,
    det: 800,
  },
  {
    profile: { id: "E" },
    allIn: false,
    det: 800,
  },
  {
    profile: { id: "F" },
    allIn: false,
    det: 500,
  },
];

pot.allIn(players as IPlayer[]);

test("test pot", () => {
  expect(pot.pots).toEqual([]);
});
