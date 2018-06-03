import * as React from "react";

type Props = {
  playtime: number;
};

export const Playtime = (props: Props) => (
  <small style={{ color: "grey" }}>
    {props.playtime ? <span>{(props.playtime / 60).toFixed(0)}m</span> : <span>? m</span>}
  </small>
);
