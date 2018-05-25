import * as React from "react";
import { TGame } from "../types/TGame";
import groupBy from "lodash.groupby";

type Props = {
  mod: string;
  clients: TGame["clients"];
  orientation: "horizontal" | "vertical";
};

const Team = (props: { mod: string; team: string; members: TGame["clients"] }) => (
  <div style={{ padding: "2px" }}>
    {props.team === "0" ? <div>No Team</div> : <div>Team {props.team}</div>}
    {props.members.map(member => (
      <div>
        <img src={`icons/${props.mod}_${member.faction.toLowerCase()}.png`} />{" "}
        {member.isadmin ? <i className="fa fa-start" /> : null} {member.isbot ? <i className="fa fa-desktop" /> : null}{" "}
        {member.isspectator ? <i className="fa fa-eye" /> : null}
        <span style={{ color: "#" + member.color }}>{" " + member.name}</span>
      </div>
    ))}
  </div>
);

export class ClientsInfo extends React.Component<Props, {}> {
  render() {
    const { clients, mod, orientation } = this.props;
    const teams = groupBy(clients, "team");
    return (
      <div style={{ display: "flex", flexDirection: orientation === "horizontal" ? "row" : "column" }}>
        {Object.keys(teams).map(key => <Team key={key} mod={mod} team={key} members={teams[key]} />)}
      </div>
    );
  }
}
