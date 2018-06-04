import { TMap } from "../types/TMap";
import chunk from "lodash.chunk";
import { TGame } from "../types/TGame";

const SPAWN_CIRCLE_BACKGROUND = "rgba(0, 0, 0, 0.3)";
const SPAWN_CIRCLE_FONT = "10px Arial";
const SPAWN_CIRCLE_FONT_COLOR = "white";

export async function drawMiniMap(ctx: CanvasRenderingContext2D, mapInfo: TMap, clients: TGame["clients"]) {
  return new Promise((resolve, _) => {
    const bounds = mapInfo.bounds.split(",").map(pos => parseInt(pos));
    const spawnPoints = chunk(mapInfo.spawnpoints.split(",").map(point => parseInt(point)), 2);

    const minimap = new Image();
    minimap.src = `data:image/jpeg;base64,${mapInfo.minimap}`;
    minimap.onload = () => {
      ctx.drawImage(minimap, bounds[0], bounds[1]);
      ctx.textAlign = "center";
      ctx.font = SPAWN_CIRCLE_FONT;
      ctx.lineWidth = 2;

      spawnPoints.forEach((spawn, index) => {
        const isClientSpawn = clients.find(client => !client.isspectator && client.spawnpoint - 1 === index);

        ctx.beginPath();
        ctx.fillStyle = isClientSpawn ? "#" + isClientSpawn.color : SPAWN_CIRCLE_BACKGROUND;

        ctx.arc(spawn[0], spawn[1], 8, 0, 360);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = SPAWN_CIRCLE_FONT_COLOR;
        ctx.strokeText(index.toString(), spawn[0], spawn[1] + 4); // +3 -> align vertical
        ctx.fillText(index.toString(), spawn[0], spawn[1] + 4); // +3 -> align vertical
      });
      resolve();
    };
  });
}
