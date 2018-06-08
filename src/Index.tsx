import * as React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { TFilter } from "./types/TFilter";
import { storage } from "./modules/LocalStorage";
import { defaultFilters } from "./data/DefaultFilters";
import { mapFetcher } from "./modules/MapFetcher";

export const Component = App;

export function mount(el: HTMLDivElement, defaultConfig?: Partial<TFilter>) {
  const filters = defaultConfig ? { ...defaultFilters, ...defaultConfig } : defaultFilters;
  storage.setDefaultFilters(filters);
  mapFetcher.loadMapsFromStorage();
  render(<App />, el);
}
