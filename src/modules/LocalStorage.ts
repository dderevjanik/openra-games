import { TSavedConfig } from "../types/TSavedConfig";
import { defaultFilters } from "../data/DefaultFilters";

const CONFIG_KEY = "SAVED_CONFIG";

class LSModule {
  // need to ignore `savedConfig` because it is set up in `reset() -after constructor was called`

  // @ts-ignore
  private savedConfig: TSavedConfig;
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
    this.savedConfig = {
      filterHasChanged: false,
      maps: {},
      filter: defaultFilters,
      version: "0.0.1"
    };
    this.save();
  }

  constructor() {
    this.exists = localStorage !== undefined;
    if (this.exists) {
      const config = localStorage.getItem(CONFIG_KEY);
      if (config !== undefined && config !== null) {
        const parsed = JSON.parse(config) as TSavedConfig;
        this.savedConfig = parsed;
      } else {
        this.reset();
      }
    } else {
      this.reset();
    }
  }
}

export const storage = new LSModule();
