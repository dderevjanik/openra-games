import * as React from "react";
import { TMap } from "../types/TMap";
import { TGame } from "../types/TGame";
import { mapFetcher } from "../modules/MapFetcher";
import { drawMiniMap } from "../modules/MiniMapDrawer";

type Props = {
  id: string;
  hash: string;
  clients: TGame["clients"];
};

type State = {
  isLoading: boolean;
  mapInfo: TMap | null;
};

export class Map extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.state = {
      isLoading: true,
      mapInfo: null
    };
  }

  canvasRef: React.RefObject<HTMLCanvasElement>;

  async componentDidMount() {
    const mapInfo = (await mapFetcher.fetchSingle(this.props.hash)) as TMap;
    if (this.canvasRef && this.canvasRef.current) {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = parseInt(mapInfo.width);
      canvas.height = parseInt(mapInfo.height);

      if (ctx) {
        drawMiniMap(ctx, mapInfo, this.props.clients); // Async
        this.setState({
          mapInfo: mapInfo,
          isLoading: false
        });
      } else {
        // TODO: Throw component error... or rather not
      }
    }
  }

  render() {
    const { props, state } = this;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {state.mapInfo ? (
            <a href={"https://resource.openra.net/maps/" + state.mapInfo.id} target="_blank">
              {state.mapInfo.title}
              {/* <i className="fa fa-external-link" /> */}
            </a>
          ) : null}
        </div>
        <canvas
          className={this.state.mapInfo ? "animated zoomIn" : "placeholder-minimap"}
          ref={this.canvasRef}
          id={props.id}
          style={{ background: "#1e2120" }}
          width={1}
          height={1}
        />
        {state.isLoading ? <i className="fa fa-2x fa-spin fa-refresh" /> : null}
        {/* <div style={{ textAlign: "center" }}>
          {state.mapInfo ? (
            <a href={state.mapInfo.url} style={{ color: "white" }}>
              Download <i className="fa fa-download" />
            </a>
          ) : null}
        </div> */}
      </div>
    );
  }
}
