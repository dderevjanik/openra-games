import * as React from "react";
import Button from "antd/lib/button";

type Props = { version: string; address: string };

export const JoinButton: React.SFC<Props> = props => (
  <Button type="ghost" href={`openra-ra-${props.version}://${props.address}`} size="small">
    Join
  </Button>
);
