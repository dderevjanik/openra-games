import * as React from "react";

import Row from "antd/lib/row";
import Input from "antd/lib/input";
import Checkbox from "antd/lib/checkbox";

import { TFilter } from "../types/TFilter";
import { AdvancedFilters } from "./AdvancedFilters";
import { RefreshButton } from "./RefreshButton";

type Props = TFilter & {
  onFilterChange: <F extends keyof TFilter>(filter: F, value: TFilter[F]) => void;
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
          <label>Show:</label>
          <div>
            <Checkbox checked={props.showPlaying} onChange={e => props.onFilterChange("showPlaying", e.target.checked)}>
              <span style={{ color: "green" }}>Playing</span>
            </Checkbox>
            <Checkbox checked={props.showWaiting} onChange={e => props.onFilterChange("showWaiting", e.target.checked)}>
              <span style={{ color: "orange" }}>Waiting</span>
            </Checkbox>
            <Checkbox checked={props.showEmpty} onChange={e => props.onFilterChange("showEmpty", e.target.checked)}>
              Empty
            </Checkbox>
            <Checkbox
              checked={props.showProtected}
              onChange={e => props.onFilterChange("showProtected", e.target.checked)}
            >
              Protected
            </Checkbox>
          </div>
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
              <i className="fa fa-filter" /> {state.showAdvancedFilters ? "Hide" : "Show"} advanced filters
            </a>
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
