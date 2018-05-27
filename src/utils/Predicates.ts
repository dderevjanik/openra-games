import { TGame } from "../types/TGame";
import { EGameState } from "../types/EGameState";

export function isRunningOrFull(game: TGame) {
  return game.state === EGameState.PLAYING || game.players === game.maxplayers;
}

export function isJoinable(game: TGame) {
  return !isRunningOrFull(game);
}
