import * as React from "react";
import { Row, Col, Slider, Select } from "antd";
import { TFilter } from "../../types/TFilter";

type TAdvancedFilters = Pick<TFilter, "players"> & Pick<TFilter, "version">;

type Props = TAdvancedFilters & {
  onFilterChange: <AF extends keyof TAdvancedFilters>(filter: AF, newValue: TAdvancedFilters[AF]) => void;
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
                onChange={(values: [number, number]) => props.onFilterChange("players", values)}
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
          <Select value={props.version} onChange={(value: string) => props.onFilterChange("version", value)}>
            <Select.Option key="20180307">{20180307}</Select.Option>
          </Select>
        </Col>
      </Row>
    );
  }
}
