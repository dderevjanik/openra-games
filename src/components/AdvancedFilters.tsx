import * as React from "react";
import fuzzy from "fuzzysearch";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Slider from "antd/lib/slider";
import Select from "antd/lib/select";
import { TFilter } from "../types/TFilter";

type TAdvancedFilters = Pick<TFilter, "players"> & Pick<TFilter, "version">;

type Props = TAdvancedFilters & {
  onFilterChange: <AF extends keyof TAdvancedFilters>(filter: AF, newValue: TAdvancedFilters[AF]) => void;
  versions: string[];
};

export class AdvancedFilters extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { props } = this;
    return (
      <Row>
        <Col span={12}>
          <Row>
            <Col span={4}>Players: </Col>
            <Col span={20}>
              <Slider
                range={true}
                min={0}
                max={16}
                value={props.players}
                onChange={values => props.onFilterChange("players", values as [number, number])}
                step={1}
                marks={{
                  0: 0,
                  2: 2,
                  4: 4,
                  8: 8,
                  16: 16
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col span={12}>
          Version:{" "}
          <Select
            value={props.version}
            onChange={value => props.onFilterChange("version", value as string)}
            filterOption={(input, option) => fuzzy(option.props.children!.toString().toLowerCase(), input)}
            style={{ minWidth: 130 }}
          >
            <Select.Option key={"-- ALL --"} value={"-- ALL --"}>
              -- ALL --
            </Select.Option>
            {props.versions.map(v => (
              <Select.Option key={v} value={v}>
                {v}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    );
  }
}
