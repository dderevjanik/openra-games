import * as React from "react";
import Button from "antd/lib/button";

export const JoinButton = (props: { version: string; address: string }) => (
  <Button type="ghost" href={`openra-ra-${props.version}://${props.address}`} size="small">
    Join
  </Button>
);
