import * as React from "react";
import { TGame } from "../types/TGame";
import groupBy from "lodash.groupby";
import Icon from "antd/lib/icon";

type Props = {
  mod: string;
  clients: TGame["clients"];
  orientation: "horizontal" | "vertical";
  showSpawnpoints: boolean;
};

const Team = (props: { mod: string; team: string; members: TGame["clients"]; showSpawnpoints: boolean }) => (
  <div style={{ padding: "2px" }}>
    <div style={{ textAlign: "left" }}>{props.team === "0" ? "No Team" : "Team " + props.team}</div>
    {props.members.map((member, index) => (
      <div key={member.name + index}>
        <img src={`icons/${props.mod}_${member.faction.toLowerCase()}.png`} />{" "}
        {member.isspectator ? <Icon type="eye-o" /> : null}
        {member.isbot ? <Icon type="desktop" /> : null}{" "}
        {props.showSpawnpoints && !member.isspectator
          ? member.spawnpoint === 0
            ? "(?)"
            : `(${member.spawnpoint - 1})`
          : ""}
        {member.isadmin ? <Icon type="star-o" style={{ marginLeft: "5px" }} /> : null}
        <span
          style={{
            color: "#" + member.color,
            textShadow: "1px 1px 0 rgba(255, 255, 255, 0.4)"
          }}
        >
          {" " + member.name + " "}
        </span>
      </div>
    ))}
  </div>
);

export const ClientsInfo = (props: Props) => {
  const teams = groupBy(props.clients, "team");
  return (
    <div
      style={{
        display: "flex",
        flexDirection: props.orientation === "horizontal" ? "row" : "column",
        flexWrap: "wrap"
      }}
      className={"players"}
    >
      {Object.keys(teams).map(team => (
        <Team key={team} mod={props.mod} team={team} members={teams[team]} showSpawnpoints={props.showSpawnpoints} />
      ))}
    </div>
  );
};
