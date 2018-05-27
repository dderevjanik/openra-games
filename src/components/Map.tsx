import * as React from "react";
import chunk from "lodash.chunk";
import { fetchMap } from "../Apiz";
import { TMap } from "../types/TMap";
import { TGame } from "../types/TGame";

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
    const mapInfo = (await fetchMap(this.props.hash))[0];
    if (this.canvasRef && this.canvasRef.current) {
      const canvas = this.canvasRef.current;
      const ctx = canvas.getContext("2d");

      canvas.width = parseInt(mapInfo.width);
      canvas.height = parseInt(mapInfo.height);

      const minimap = new Image();
      minimap.src = `data:image/jpeg;base64,${mapInfo.minimap}`;
      minimap.onload = () => {
        // TODO: draw minimap asynchronously, move it to another method that can be used on every component's update
        const bounds = mapInfo.bounds.split(",").map(pos => parseInt(pos));
        const spawnPoints = chunk(mapInfo.spawnpoints.split(",").map(point => parseInt(point)), 2);

        ctx!.drawImage(minimap, bounds[0], bounds[1]);
        ctx!.textAlign = "center";
        ctx!.font = "10px Arial";
        ctx!.lineWidth = 2;

        spawnPoints.forEach((spawn, index) => {
          const isClientSpawn = this.props.clients.find(
            client => !client.isspectator && client.spawnpoint - 1 === index
          );

          ctx!.beginPath();
          ctx!.fillStyle = isClientSpawn ? "#" + isClientSpawn.color : "rgba(0, 0, 0, 0.3)";

          ctx!.arc(spawn[0], spawn[1], 8, 0, 360);
          ctx!.fill();
          ctx!.stroke();

          ctx!.fillStyle = "white";
          ctx!.strokeText(index.toString(), spawn[0], spawn[1] + 4); // +3 -> align vertical
          ctx!.fillText(index.toString(), spawn[0], spawn[1] + 4); // +3 -> align vertical
        });

        this.setState({
          mapInfo: mapInfo,
          isLoading: false
        });
      };
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
        <canvas ref={this.canvasRef} id={props.id} style={{ background: "#1e2120" }} width={1} height={1} />
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
