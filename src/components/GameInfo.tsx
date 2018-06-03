import * as React from "react";

type Props = {
  gameVersion: string;
  allVersions: string[];
  address: string;
  location: boolean | string;
  mod: string;
};

export const GameInfo = (props: Props) => (
  <div>
    <div>
      <b>Mod:</b> {props.mod}
    </div>
    <div>
      <b>Version:</b> {props.gameVersion}
      {props.gameVersion === props.allVersions[0] ? (
        <span style={{ color: "green", marginLeft: "5px" }}>[Latest]</span>
      ) : null}{" "}
    </div>
    <div>
      <b>Address:</b> {props.address}
    </div>
    <div>
      <b>Location:</b> {props.location ? props.location : "Unknown"}
    </div>
  </div>
);
