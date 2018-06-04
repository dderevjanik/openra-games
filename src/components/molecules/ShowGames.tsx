import * as React from "react";
import Checkbox, { CheckboxChangeEvent } from "antd/lib/checkbox";
import { TFilter } from "../../types/TFilter";

type Props = {
  showPlaying: boolean;
  showWaiting: boolean;
  showEmpty: boolean;
  showProtected: boolean;
  onFilterChange: <F extends keyof TFilter>(filter: F, value: TFilter[F]) => void;
};

export class ShowGames extends React.PureComponent<Props> {
  togglePlaying = (e: CheckboxChangeEvent) => {
    this.props.onFilterChange("showPlaying", e.target.checked);
  };

  toggleWaiting = (e: CheckboxChangeEvent) => {
    this.props.onFilterChange("showWaiting", e.target.checked);
  };

  toggleEmpty = (e: CheckboxChangeEvent) => {
    this.props.onFilterChange("showEmpty", e.target.checked);
  };

  toggleProtected = (e: CheckboxChangeEvent) => {
    this.props.onFilterChange("showProtected", e.target.checked);
  };

  render() {
    const { props } = this;
    return (
      <>
        <label>Show:</label>
        <div>
          <Checkbox checked={props.showPlaying} onChange={this.togglePlaying}>
            <span style={{ color: "green" }}>Playing</span>
          </Checkbox>
          <Checkbox checked={props.showWaiting} onChange={this.toggleWaiting}>
            <span style={{ color: "orange" }}>Waiting</span>
          </Checkbox>
          <Checkbox checked={props.showEmpty} onChange={this.toggleEmpty}>
            Empty
          </Checkbox>
          <Checkbox checked={props.showProtected} onChange={this.toggleProtected}>
            Protected
          </Checkbox>
        </div>
      </>
    );
  }
}
