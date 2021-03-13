import Rengine from "./engine/engine";
import { EndGameLoop } from "./engine/Loop";

export const RENDERING_ENGINE: RenderingEngineOption = 'canvas';
export const LOOP_MODE: LoopMode = 'animation';
export const SHOW_TRANSFORMATION_POINTS: boolean = false;
export const FPS_LIMIT = 60;

export const init = (canvas?: HTMLCanvasElement): EngineState => {
  let engineState = Rengine.Game.InitEngine(undefined, canvas);
  engineState = Rengine.Scene.CreateScene(engineState)('root', true);
  return engineState;
}

let timePassed = 0;

export const update = (delta: number, es: EngineState): EngineState => {
  timePassed += delta;
  if(timePassed > 20000){
    EndGameLoop();
  }
  return es;
}