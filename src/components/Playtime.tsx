import * as React from "react";

type Props = {
  playtime: number;
};

export const Playtime = (props: Props) => {
  if (props.playtime) {
    if (props.playtime >= 3600) {
      const hours = parseInt((props.playtime / 3600).toFixed(0));
      const minutes = ((props.playtime - hours * 3600) / 60).toFixed(0);
      return (
        <small style={{ color: "grey" }}>
          <span>{hours}h</span>
          <span>{minutes}m</span>
        </small>
      );
    } else {
      return (
        <small style={{ color: "grey" }}>
          <span>{(props.playtime / 60).toFixed(0)}m</span>
        </small>
      );
    }
  } else {
    return (
      <small style={{ color: "grey" }}>
        <span>? m</span>
      </small>
    );
  }
};
