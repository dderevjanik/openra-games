import { TSavedConfig } from "../types/TSavedConfig";
import { TFilter } from "../types/TFilter";

const CONFIG_KEY = "SAVED_CONFIG";

class LSModule {
  // need to ignore `savedConfig` because it is set up in `reset() -after constructor was called`

  // @ts-ignore
  private savedConfig: TSavedConfig;
  // @ts-ignore
  private defaultFilters: TFilter;
  readonly exists: boolean;

  private save() {
    if (this.exists) {
      const stringified = JSON.stringify(this.savedConfig);
      localStorage.setItem(CONFIG_KEY, stringified);
    }
  }

  async set<K extends keyof TSavedConfig>(key: K, data: TSavedConfig[K]) {
    this.savedConfig[key] = data;
    this.save();
  }

  get<K extends keyof TSavedConfig>(key: K): TSavedConfig[K] {
    return this.savedConfig[key];
  }

  async reset() {
    if (!this.defaultFilters) {
      throw new Error("default filters are not defined!");
    }
    this.savedConfig = {
      filterHasChanged: false,
      maps: {},
      filter: this.defaultFilters,
      version: "0.0.1"
    };
    this.save();
  }

  setDefaultFilters(filters: TFilter) {
    this.defaultFilters = filters;
    if (!this.savedConfig) {
      this.savedConfig = {
        filterHasChanged: false,
        maps: {},
        filter: filters,
        version: "0.0.1"
      };
    }
  }

  constructor() {
    this.exists = localStorage !== undefined;
    if (this.exists) {
      const config = localStorage.getItem(CONFIG_KEY);
      if (config !== undefined && config !== null) {
        const parsed = JSON.parse(config) as TSavedConfig;
        this.savedConfig = parsed;
      } else {
        // this.reset();
      }
    } else {
      // this.reset();
    }
  }
}

export const storage = new LSModule();
