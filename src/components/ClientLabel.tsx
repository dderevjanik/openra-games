import * as React from "react";
import Tag from "antd/lib/tag";
import Tooltip from "antd/lib/tooltip";
import { TGame } from "../types/TGame";
import { ClientsInfo } from "./ClientsInfo";

type Props = {
  game: TGame;
};

export const ClientLabel = (props: Props) => {
  if (props.game.clients.length === 0) {
    return null;
  }
  return (
    <Tooltip
      title={
        <ClientsInfo
          clients={props.game.clients}
          mod={props.game.mod}
          orientation={"vertical"}
          showSpawnpoints={false}
        />
      }
      getPopupContainer={target => target as HTMLElement}
    >
      <Tag>
        {props.game.players > 0 ? (
          <span>
            <i className="fa fa-user" />
            {" " + props.game.players + " "}
          </span>
        ) : null}
        {props.game.bots > 0 ? (
          <span>
            <i className="fa fa-desktop" />
            {" " + props.game.bots + " "}
          </span>
        ) : null}
        {props.game.spectators > 0 ? (
          <span>
            <i className="fa fa-eye" />
            {" " + props.game.spectators + " "}
          </span>
        ) : null}
      </Tag>
    </Tooltip>
  );
};
