import { TFilter } from "./TFilter";
import { TMap } from "./TMap";

export type TSavedConfig = {
  version: "0.0.1";
  filterHasChanged: boolean;
  filter: TFilter;
  maps: { [hash: string]: TMap };
};
