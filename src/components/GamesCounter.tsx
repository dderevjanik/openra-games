import * as React from "react";

export const GamesCounter = (props: { current: number; total: number }) => (
  <div style={{ textAlign: "center", color: "grey" }}>
    <small>
      {props.current} / {props.total}
    </small>
  </div>
);
