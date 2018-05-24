import * as React from "react";
import { TGame } from "../../types/TGame";
import { Tag, Tooltip } from "antd";

type Props = {
  client: TGame["clients"][0];
};

export class Client extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    const { client } = this.props;
    const icon = client.isspectator ? <i className="fa fa-eye" /> : <i className="fa fa-user" />;
    return client.isspectator ? (
      <Tooltip title={client.isadmin ? "Admin" : "Spectator"}>
        <Tag color="grey">
          {icon} {client.name}
        </Tag>
      </Tooltip>
    ) : (
      <Tooltip
        title={
          <div>
            {client.isadmin ? (
              <div>
                <b>Admin</b>
              </div>
            ) : null}
            <div>Faction: {client.faction}</div>
            <div>Team: {client.team}</div>
            <div>Spawnpoint: {client.spawnpoint}</div>
          </div>
        }
      >
        <Tag color={`#${client.color}`}>
          {icon} {client.name}
        </Tag>
      </Tooltip>
    );
  }
}
