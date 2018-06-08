import * as React from "react";

type Props = {
  current: number;
  total: number;
};

export const GamesCounter: React.SFC<Props> = props => (
  <div style={{ textAlign: "center", color: "grey" }}>
    <small>
      {props.current} / {props.total}
    </small>
  </div>
);
