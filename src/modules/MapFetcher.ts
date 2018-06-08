import { storage } from "./LocalStorage";
import { TMap } from "../types/TMap";
import { fetchMap } from "../Api";

class MapFetcher {
  private cachedMaps: { [hash: string]: TMap } = {};
  private readonly waitingList: { [hash: string]: ((map: TMap) => void)[] } = {};

  // @ts-ignore
  private readonly fetchInterval: number;

  // constructor() {
  //   if (storage.exists) {
  //     this.cachedMaps = storage.get("maps") || {};
  //   }

  //   // this.fetchInterval = window.setInterval(() => {
  //   //   this.tryToFetchMaps();
  //   // }, 5000);
  // }
  loadMapsFromStorage() {
    this.cachedMaps = storage.get("maps");
  }

  // private tryToFetchMaps = () => {
  //   const hashes = Object.keys(this.waitingList);
  //   if (hashes.length > 0) {
  //     fetchMaps(hashes.slice(0, 20)).then(result => this.resolveFetchedMaps(result));
  //     // TODO: Catch errors
  //   }
  // };

  // private resolveFetchedMaps = (fetchedMaps: TMap[]) => {
  //   const fetchedHashes = fetchedMaps.map(m => m.map_hash);
  //   const waitingHashes = Object.keys(this.waitingList);

  //   // For each fetched hash, try to resolve its waiting listeners and then delete them
  //   fetchedHashes.forEach((hash, index) => {
  //     if (waitingHashes.includes(hash)) {
  //       this.waitingList[hash].forEach(callback => callback(fetchedMaps[index]));
  //     }

  //     // add newly fetched maps to cache
  //     if (!Object.keys(this.cachedMaps).includes(hash)) {
  //       this.cachedMaps[hash] = fetchedMaps[index];
  //     }

  //     delete this.waitingList[hash];
  //   });

  //   if (storage.exists) {
  //     storage.set("maps", this.cachedMaps);
  //   }
  // };

  private addToWaitingList = (hash: string, listener: (map: TMap) => void) => {
    if (Object.keys(this.waitingList).includes(hash)) {
      this.waitingList[hash].push(listener);
    } else {
      this.waitingList[hash] = [listener];
    }
  };

  private isMapCached = (hash: string): boolean => {
    const isCached = Object.keys(this.cachedMaps).includes(hash);
    return isCached;
  };

  private getCachedMap = (hash: string): TMap | null => {
    return this.cachedMaps[hash];
  };

  async fetch(hash: string) {
    return new Promise((resolve, _) => {
      // First, try to obtain map from cache
      if (this.isMapCached(hash)) {
        const cachedMap = this.getCachedMap(hash);
        resolve(cachedMap as any); // TODO: hack :/
      } else {
        // Otherwise, we need to make a fetch, add to waiting list
        this.addToWaitingList(hash, (map: TMap) => resolve(map));
      }
      // TODO: add timer for throwing an error
    });
  }

  async fetchSingle(hash: string) {
    return new Promise(async (resolve, _) => {
      if (this.isMapCached(hash)) {
        const cachedMap = this.getCachedMap(hash);
        resolve(cachedMap as any); // TODO: hack :/
      } else {
        const fetchedMap = (await fetchMap(hash))[0];
        this.cachedMaps[fetchedMap.map_hash] = fetchedMap;
        if (storage.exists) {
          storage.set("maps", this.cachedMaps);
        }
        resolve(fetchedMap);
      }
    });
  }
}

export const mapFetcher = new MapFetcher();
