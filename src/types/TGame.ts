export type TGame = {
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
    faction: string; // TODO: add icon
    isadmin: boolean;
    isbot: boolean;
    isspectator: boolean;
    name: string;
    spawnpoint: number;
    team: number;
  }>;
  id: number;
  location: boolean;
  map: string;
  maxplayers: number;
  mod: string; // TODO: add icons
  name: string;
  players: number;
  protected: boolean;
  spectators: number;
  state: number;
  ttl: number;
  version: string;
};
