import referee from "../referee";

test("test referee", () => {
  expect(referee(["6s", "Js", "6h", "Qh", "Kh"], ["5d", "Qd"])).toBe("Two pairs");
});
