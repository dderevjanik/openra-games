import { TGame } from "./types/TGame";
import { TMap } from "./types/TMap";
import { TVersion } from "./types/TVersion";
import { apiCall } from "./utils/ApiCall";

const URL_GAMES = "https://master.openra.net/games?protocol=2&type=json";
const URL_MAP = "https://resource.openra.net/map/hash";
const URL_VERSIONS = "https://www.openra.net/versions.json";

export function fetchGames(): Promise<TGame[]> {
  return apiCall(URL_GAMES);
}

/**
 * @param hash - map hash
 */
export function fetchMap(hash: string): Promise<TMap[]> {
  return apiCall(`${URL_MAP}/${hash}`);
}

/**
 * @param hashes - array of map hash
 */
export function fetchMaps(hashes: string[]): Promise<TMap[]> {
  return apiCall(`${URL_MAP}/${hashes.join(",")}`);
}

export function fetchOpenRAVersions(): Promise<TVersion> {
  return apiCall(URL_VERSIONS);
}
