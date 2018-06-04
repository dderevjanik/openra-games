import * as React from "react";
import { TMap } from "../../types/TMap";
import { TGame } from "../../types/TGame";
import { mapFetcher } from "../../modules/MapFetcher";
import { drawMiniMap } from "../../modules/MiniMapDrawer";
import Icon from "antd/lib/icon";

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
    if (this.canvasRef && this.canvasRef.current) {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");

      const mapInfo = (await mapFetcher.fetchSingle(this.props.hash)) as TMap;
      canvas.width = parseInt(mapInfo.width);
      canvas.height = parseInt(mapInfo.height);

      if (ctx) {
        drawMiniMap(ctx, mapInfo, this.props.clients); // Async
        this.setState({
          mapInfo: mapInfo,
          isLoading: false
        });
      } else {
        // Throw component error... or rather not
      }
    }
  }

  render() {
    const { props, state } = this;
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          {state.mapInfo ? (
            <a
              href={"https://resource.openra.net/maps/" + state.mapInfo.id}
              target="_blank"
              style={{ display: "flex", alignItems: "center" }}
            >
              {state.mapInfo.title + " "}
              <small style={{ marginLeft: "5px" }}>
                <Icon type="link" />
              </small>
            </a>
          ) : null}
        </div>
        <canvas
          className={this.state.mapInfo ? "animated zoomIn" : "placeholder-minimap"}
          ref={this.canvasRef}
          id={props.id}
          style={{ background: "#1e2120", maxWidth: "200px" }}
          width={1}
          height={1}
        />
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
