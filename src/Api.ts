import { TGame } from "./types/TGame";
import { TMap } from "./types/TMap";
import { TVersion } from "./types/TVersion";
import { asyncFetch } from "./utils/Fetch";

const URL_GAMES = "https://master.openra.net/games?protocol=2&type=json";
const URL_MAP = "https://resource.openra.net/map/hash";
const URL_VERSIONS = "https://www.openra.net/versions.json";

export function fetchGames(): Promise<TGame[]> {
  return asyncFetch(URL_GAMES);
}

/**
 * @param hash - map hash
 */
export function fetchMap(hash: string): Promise<TMap[]> {
  return asyncFetch(`${URL_MAP}/${hash}`);
}

export function fetchOpenRAVersions(): Promise<TVersion> {
  return asyncFetch(URL_VERSIONS);
}
