import * as React from "react";

import Row from "antd/lib/row";
import Input from "antd/lib/input";

import { TFilter } from "../types/TFilter";
import { AdvancedFilters } from "./molecules/AdvancedFilters";
import { RefreshButton } from "./RefreshButton";
import { ShowGames } from "./molecules/ShowGames";
import Icon from "antd/lib/icon";

type Props = TFilter & {
  onFilterChange: <F extends keyof TFilter>(filter: F, value: TFilter[F]) => void;
  onResetFilters: () => void;
  filterHasChanged: boolean;
  isLoading: boolean;
  versions: string[];
  onRefresh: () => void;
};

type State = {
  showAdvancedFilters: boolean;
};

export class Filters extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showAdvancedFilters: false
    };
  }

  render() {
    const { props, state } = this;
    return (
      <div className={"filters"}>
        <Row style={{ alignItems: "center" }}>
          <ShowGames
            showPlaying={props.showPlaying}
            showWaiting={props.showWaiting}
            showEmpty={props.showEmpty}
            showProtected={props.showProtected}
            onFilterChange={props.onFilterChange}
          />
        </Row>

        <Row>
          <Input.Search
            placeholder="Search for a game..."
            value={props.search}
            onChange={e => props.onFilterChange("search", e.target.value)}
            className={"searchname"}
          />
        </Row>
        <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
          <div style={{ background: state.showAdvancedFilters ? "rgba(39, 45, 44, 0.5)" : "", padding: "4px 10px" }}>
            <a href="#" onClick={() => this.setState({ showAdvancedFilters: !this.state.showAdvancedFilters })}>
              <Icon type="filter" /> {state.showAdvancedFilters ? "Hide" : "Show"} advanced filters
            </a>{" "}
            {props.filterHasChanged ? (
              <a href="#" onClick={props.onResetFilters} style={{ marginLeft: "10px" }}>
                <Icon type="close" /> Reset Filters
              </a>
            ) : null}
          </div>
          <div style={{ padding: "4px 10px" }}>
            <RefreshButton isLoading={props.isLoading} onRefresh={props.onRefresh} />
          </div>
        </div>
        {state.showAdvancedFilters ? (
          <AdvancedFilters
            onFilterChange={props.onFilterChange}
            versions={props.versions}
            version={props.version}
            players={props.players}
            games={props.games}
          />
        ) : null}
      </div>
    );
  }
}
