import { TGame } from "../types/TGame";

export function alphabeticalSorter(game1: TGame, game2: TGame) {
  const aName = game1.name.toLowerCase();
  const bName = game2.name.toLowerCase();
  if (aName < bName) {
    return -1;
  }
  if (aName > bName) {
    return 1;
  }
  return 0;
}
