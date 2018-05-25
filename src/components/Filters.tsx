import * as React from "react";

import Row from "antd/lib/row";
import Select from "antd/lib/select";
import Input from "antd/lib/input";
import Checkbox from "antd/lib/checkbox";

import { Data } from "../data/Data";
import { TFilter } from "../types/TFilter";
import { AdvancedFilters } from "./AdvancedFilters";

type Props = TFilter & {
  onFilterChange: <F extends keyof TFilter>(filter: F, value: TFilter[F]) => void;
  versions: string[];
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
        <Row>
          <label>Show:</label>
          <div>
            <Checkbox checked={props.showPlaying} onChange={e => props.onFilterChange("showPlaying", e.target.checked)}>
              Playing
            </Checkbox>
            <Checkbox checked={props.showWaiting} onChange={e => props.onFilterChange("showWaiting", e.target.checked)}>
              Waiting
            </Checkbox>
            <Checkbox checked={props.locked} onChange={e => props.onFilterChange("locked", e.target.checked)}>
              Locked
            </Checkbox>
          </div>
        </Row>
        <Row>
          <label>Mods:</label>
          <div>
            <Select
              mode="tags"
              value={props.games}
              tokenSeparators={[","]}
              onChange={values => props.onFilterChange("games", values as string[])}
              style={{ minWidth: 200 }}
              className={"tags"}
              getPopupContainer={(target) => target as HTMLElement}
            >
              {Data.mods.map((mod, index) => (
                <Select.Option key={index} value={mod.mod}>
                  <img width="16" height="16" alt={mod.name} src={`icons/${mod.icon}`} /> {mod.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </Row>
        <Row>
          <a href="#" onClick={() => this.setState({ showAdvancedFilters: !this.state.showAdvancedFilters })}>
            <i className="fa fa-filter" /> Show advanced filters
          </a>
        </Row>
        {state.showAdvancedFilters ? (
          <AdvancedFilters
            onFilterChange={props.onFilterChange}
            versions={props.versions}
            version={props.version}
            players={props.players}
          />
        ) : null}
        <Row>
          <Input.Search
            placeholder="Search for a game..."
            value={props.search}
            onChange={e => props.onFilterChange("search", e.target.value)}
            className={"searchname"}
          />
        </Row>
      </div>
    );
  }
}
