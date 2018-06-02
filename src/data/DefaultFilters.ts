import { TFilter } from "../types/TFilter";

export const defaultFilters: TFilter = {
  showEmpty: true,
  showProtected: true,
  games: ["ra", "cnc"],
  players: [0, 10],
  search: "",
  showPlaying: false,
  showWaiting: true,
  version: "release-20180307" // Doesn't matter, will change right after it fetch versions list and will be replaced be newest one
};
