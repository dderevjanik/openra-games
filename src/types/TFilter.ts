export type TFilter = Readonly<{
  version: string;
  players: [number, number];
  games: string[];
  showWaiting: boolean;
  showPlaying: boolean;
  search: string;
  showProtected: boolean;
  showEmpty: boolean;
}>;
