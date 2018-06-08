import * as React from "react";

import Tag from "antd/lib/tag";
import Tooltip from "antd/lib/tooltip";
import Icon from "antd/lib/icon";

import { TGame } from "../../types/TGame";
import { ClientsInfo } from "../ClientsInfo";

type Props = {
  game: TGame;
};

export const ClientLabel: React.SFC<Props> = props => {
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
            <Icon type="user" />
            {" " + props.game.players + " "}
          </span>
        ) : null}
        {props.game.bots > 0 ? (
          <span>
            <Icon type="desktop" />
            {" " + props.game.bots + " "}
          </span>
        ) : null}
        {props.game.spectators > 0 ? (
          <span>
            <Icon type="eye-o" />
            {" " + props.game.spectators + " "}
          </span>
        ) : null}
      </Tag>
    </Tooltip>
  );
};
