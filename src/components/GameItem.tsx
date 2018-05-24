import * as React from "react";
import { List, Avatar, Tag, Tooltip } from "antd";
import { TGame } from "../../types/TGame";
import { Data } from "../data/Data";
import { Client } from "./Client";

const OPENRA_CURRENT_VERSION = 20180307;
type Props = {
  game: TGame;
};
export class GameItem extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  getGameState(state: number) {
    switch (state) {
      case 1: {
        return <span style={{ color: "orange" }}>Waiting</span>;
      }
      case 2: {
        return <span style={{ color: "green" }}>Playing</span>;
      }
      default: {
        return <span>Unknown State</span>;
      }
    }
  }

  render() {
    const { game } = this.props;
    const gameData = Data.mods.find(m => m.mod === game.mod);
    // TODO: show players, then computer players and last spectators
    return (
      <List.Item actions={[<a href={`openra-ra-release-${OPENRA_CURRENT_VERSION}://${game.address}/`}>Join Game</a>]}>
        <List.Item.Meta
          avatar={
            gameData ? (
              <Avatar src={`icons/${gameData.icon}`} shape="circle" style={{ border: `1px solid ${gameData.color}` }} />
            ) : (
              game.mod
            )
          }
          title={
            <a href="#">
              {game.protected ? <i className="fa fa-lock" /> : null}
              {" " + game.name + " "}
              {`[${game.players} / ?]`}
            </a>
          }
          description={
            <span>
              {game.address} {this.getGameState(game.state)}
            </span>
          }
        />
        <div>
          {[
            game.clients.filter(client => !client.isbot).map((client, index) => <Client key={index} client={client} />),
            game.bots > 0 ? (
              <Tooltip
                title={
                  <div>
                    {game.clients.filter(c => c.isbot === true).map(b => (
                      <div>
                        <div>
                          {b.faction} <span style={{ color: b.color }}>{b.name}</span> [{b.team}]
                        </div>
                      </div>
                    ))}
                  </div>
                }
              >
                <Tag color="lightgrey">
                  <i className="fa fa-desktop" /> {game.bots}
                </Tag>
              </Tooltip>
            ) : null
          ]}
        </div>
      </List.Item>
    );
  }
}
