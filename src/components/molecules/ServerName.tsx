import * as React from "react";

import Tooltip from "antd/lib/tooltip";
import Icon from "antd/lib/icon";
import { GameInfo } from "../atoms/GameInfo";

type Props = {
  isLatestVersion: boolean;
  address: string;
  gameVersion: string;
  location: string;
  mod: string;
  serverName: string;
  state: number;
  players: number;
  isProtected: boolean;
};

export const ServerName = (props: Props) => (
  <>
    <Tooltip
      getPopupContainer={target => target as HTMLElement}
      title={
        <GameInfo
          isLatest={props.isLatestVersion}
          address={props.address}
          gameVersion={props.gameVersion}
          location={props.location}
          mod={props.mod}
        />
      }
    >
      <div style={{ marginLeft: "4px", marginRight: "15px" }}>
        <img src={`icons/${props.mod}.png`} height={24} />
      </div>
    </Tooltip>
    {props.isProtected ? (
      <Tooltip title={<small>Game is password protected</small>} getPopupContainer={target => target as HTMLElement}>
        <small style={{ marginLeft: "5px" }}>
          <Icon type="lock" />
        </small>
      </Tooltip>
    ) : null}{" "}
    <span
      style={{
        marginLeft: "5px",
        color: props.state === 2 ? "green" : props.players > 0 ? "orange" : ""
      }}
    >
      {props.serverName}
    </span>
  </>
);
