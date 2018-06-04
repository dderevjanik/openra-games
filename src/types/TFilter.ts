export type TFilter = Readonly<{
  version: string;

  /**
   * min/max players
   */
  players: [number, number];

  /**
   * List of games to show, e.g. ra, cnc, d2k, ts
   */
  games: string[];
  showWaiting: boolean;
  showPlaying: boolean;
  search: string;
  showProtected: boolean;
  showEmpty: boolean;
}>;
