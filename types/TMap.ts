export type TMap = {
  description: string;
  url: string;
  /**
   * number delimited by ','
   */
  spawnpoints: string;
  width: string;
  requires_upgrade: boolean;
  map_grid_type: string;
  id: number;
  downloading: boolean;
  rules: string;
  bounds: string;
  players: number;
  reports: number;
  lua: boolean;
  license: string;
  downloaded: number;
  title: string;
  players_block: string;
  author: string;
  info: string;
  rating: number;
  mapformat: number;
  last_revision: string;
  tileset: string; // TODO: add icons
  /**
   * base64 format
   */
  minimap: string;
  map_type: string;
  revision: number;
  advanced_map: boolean;
  /**
   * OpenRA version
   */
  parser: string;
  viewed: number;
  /**
   * DateTime "2017-02-18 20:53:42.604546+00:00";
   */
  posted: string;
  categories: string[]; // TODO: add icons
  game_mod: string; // TODO: add icons
  map_hash: string;
  height: string;
};
