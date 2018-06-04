import { TFilter } from "./TFilter";
import { TMap } from "./TMap";

export type TSavedConfig = {
  /**
   * Games browser version, not ORA
   */
  version: "0.0.1";

  /**
   * Check if any filter changed
   */
  filterHasChanged: boolean;

  /**
   * List of applied filters
   */
  filter: TFilter;

  /**
   * Cached maps
   */
  maps: { [hash: string]: TMap };
};
