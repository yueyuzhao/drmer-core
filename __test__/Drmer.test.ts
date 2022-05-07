import {Drmer} from "../src";

test("drmer is instance of Drmer", () => {
  const drmer = new Drmer();

  expect(drmer).toBeInstanceOf(Drmer);
  drmer.destroy();
});
