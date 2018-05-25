export type TFilter = {
  version: string;
  players: [number, number];
  games: string[];
  showWaiting: boolean;
  showPlaying: boolean;
  search: string;
  locked: boolean;
};
