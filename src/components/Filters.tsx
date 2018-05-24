import * as React from "react";
import { Row, Col, Select, Input, Checkbox, Slider } from "antd";
import { Data } from "../data/Data";
import { TFilter } from "../../types/TFilter";
import { AdvancedFilters } from "./AdvancedFilters";

type Props = TFilter & {
  onFilterChange: <F extends keyof TFilter>(filter: F, value: TFilter[F]) => void;
};

export class Filters extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { props } = this;
    return (
      <>
        <Row>
          <Col span={12}>
            Show:
            <Checkbox checked={props.showPlaying} onChange={e => props.onFilterChange("showPlaying", e.target.checked)}>
              Playing
            </Checkbox>
            <Checkbox checked={props.showWaiting} onChange={e => props.onFilterChange("showWaiting", e.target.checked)}>
              Waiting
            </Checkbox>
            <Checkbox checked={props.locked} onChange={e => props.onFilterChange("locked", e.target.checked)}>
              Locked
            </Checkbox>
          </Col>
          <Col span={12}>
            Mods:{" "}
            <Select
              mode="tags"
              value={props.games}
              tokenSeparators={[","]}
              onChange={values => props.onFilterChange("games", values as string[])}
            >
              {Data.mods.map((mod, index) => (
                <Select.Option key={index} value={mod.mod}>
                  <img width="16" height="16" alt={mod.name} src={`icons/${mod.icon}`} /> {mod.name}
                </Select.Option>
              ))}
            </Select>
          </Col>
        </Row>
        <AdvancedFilters
          onFilterChange={this.props.onFilterChange}
          version={this.props.version}
          players={this.props.players}
        />
        <Row>
          <Input.Search
            placeholder="Search for a game..."
            value={props.search}
            onChange={e => props.onFilterChange("search", e.target.value)}
          />
        </Row>
      </>
    );
  }
}
