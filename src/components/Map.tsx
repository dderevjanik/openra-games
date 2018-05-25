import * as React from "react";
import { fetchMap } from "../Apiz";
import { TMap } from "../types/TMap";
import { TGame } from "../types/TGame";

type Props = {
  id: string;
  hash: string;
  clients: TGame["clients"];
};

type State = {
  mapInfo: TMap | null;
};

export class Map extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.canvasRef = React.createRef<HTMLCanvasElement>();
    this.state = {
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

      const spawnPoints = mapInfo.spawnpoints.split(",");

      const minimap = new Image();
      minimap.src = `data:image/jpeg;base64,${mapInfo.minimap}`;
      minimap.onload = () => {
        ctx!.drawImage(minimap, 0, 0);
        this.props.clients.forEach(client => {
          ctx!.fillStyle = `#${client.color}`;
          ctx!.strokeStyle = "white";
          if (client.spawnpoint === 0) {
            // For spectators and players without a spawnpoint
            return;
          }
          const x = parseInt(spawnPoints[(client.spawnpoint - 1) * 2]);
          const y = parseInt(spawnPoints[(client.spawnpoint - 1) * 2 + 1]);
          ctx!.fillRect(x - 4, y - 4, 8, 8);
          ctx!.strokeRect(x - 4, y - 4, 8, 8);
        });
        this.setState({
          mapInfo: mapInfo
        });
      };
    }
  }

  render() {
    const { props, state } = this;
    return (
      <div>
        <canvas ref={this.canvasRef} id={props.id} />
        <div>
          {state.mapInfo ? (
            <a href={"https://resource.openra.net/maps/" + state.mapInfo.id}>
              {state.mapInfo.title} <i className="fa fa-external-link" />
            </a>
          ) : null}
        </div>
      </div>
    );
  }
}
