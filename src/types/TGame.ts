export type TGameBase = {
  /**
   * IP Address
   */
  address: string;
  bots: number;
  clients: Array<{
    /**
     * Hex value without prefix '#'
     */
    color: string;
    faction: string;
    isadmin: boolean;
    isbot: boolean;
    isspectator: boolean;
    name: string;
    spawnpoint: number;
    team: number;
  }>;
  id: number;
  location: string;
  map: string;
  maxplayers: number;
  mod: string;
  name: string;
  players: number;
  protected: boolean;
  spectators: number;
  ttl: number;
  version: string;
};

export type TGame =
  | Readonly<
      {
        state: 2;
        /**
         * Date in format "YYYY-MM-DD"
         */
        started: string;
        playtime: number;
      } & TGameBase
    >
  | Readonly<{ state: 1 } & TGameBase>;
