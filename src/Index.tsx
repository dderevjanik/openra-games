import * as React from "react";
import { render } from "react-dom";
import { App } from "./App";
import { TFilter } from "./types/TFilter";
import { storage } from "./modules/LocalStorage";
import { defaultFilters } from "./data/DefaultFilters";

export const Component = App;

export function mount(el: HTMLDivElement, defaultConfig?: Partial<TFilter>) {
  if (storage.exists) {
    storage.set("filter", { ...defaultFilters, ...defaultConfig });
  }
  render(<App />, el);
}
