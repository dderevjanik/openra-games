import * as React from "react";
import { mapFetcher } from "../modules/MapFetcher";
import { TMap } from "../types/TMap";

type Props = {
  mapHash: string;
};

type State = {
  mapName: string;
  isLoading: boolean;
};

export class MapName extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mapName: "",
      isLoading: true
    };
  }

  async componentDidMount() {
    const fetchedMap = (await mapFetcher.fetch(this.props.mapHash)) as TMap;
    this.setState({
      mapName: fetchedMap.title,
      isLoading: false
    });
  }

  render() {
    return this.state.isLoading ? <small>Loading... </small> : <small>{this.state.mapName}</small>;
  }
}
