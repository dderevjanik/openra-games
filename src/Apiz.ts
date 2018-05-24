import { TGame } from "../types/TGame";
import { TMap } from "../types/TMap";
import { apiCall } from "./utils/ApiCall";

const URL_GAMES = "https://master.openra.net/games?protocol=2&type=json";
const URL_MAP = "https://resource.openra.net/map/hash";

export function fetchGames(): Promise<TGame[]> {
  return apiCall(URL_GAMES);
}

/**
 * @param hash - map hash
 */
export function fetchMap(hash: string): Promise<TMap> {
  return apiCall(`${URL_MAP}/${hash}`);
}
