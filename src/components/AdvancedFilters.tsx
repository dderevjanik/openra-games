import * as React from "react";

import fuzzy from "fuzzysearch";
import Row from "antd/lib/row";
import Slider from "antd/lib/slider";
import Select from "antd/lib/select";
import Col from "antd/lib/col";
import { TFilter } from "../types/TFilter";
import { ModData } from "../data/ModData";

type TAdvancedFilters = Pick<TFilter, "players"> & Pick<TFilter, "version"> & Pick<TFilter, "games">;

type Props = TAdvancedFilters & {
  onFilterChange: <AF extends keyof TAdvancedFilters>(filter: AF, newValue: TAdvancedFilters[AF]) => void;
  versions: string[];
};

export const AdvancedFilters = (props: Props) => (
  <div style={{ padding: "10px", background: "rgba(39, 45, 44, 0.5)" }}>
    <Row>
      <Col span={8}>
        <label>Version:</label>
        <Select
          value={props.version}
          onChange={value => props.onFilterChange("version", value as string)}
          filterOption={(input, option) => fuzzy(option.props.children!.toString().toLowerCase(), input)}
          style={{ minWidth: 130 }}
          getPopupContainer={target => target as HTMLElement}
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
      <Col span={14}>
        <label>Players:</label>
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
    <Row style={{ alignItems: "center" }}>
      <label>Mods:</label>
      <div>
        <Select
          mode="tags"
          value={props.games}
          tokenSeparators={[","]}
          onChange={values => props.onFilterChange("games", values as string[])}
          style={{ minWidth: 200 }}
          className={"tags"}
          getPopupContainer={target => target as HTMLElement}
        >
          {ModData.mods.map((mod, index) => (
            <Select.Option key={index} value={mod.mod}>
              <img width="16" height="16" alt={mod.name} src={`icons/${mod.icon}`} />
              <span>{mod.name}</span>
            </Select.Option>
          ))}
        </Select>
      </div>
    </Row>
  </div>
);
