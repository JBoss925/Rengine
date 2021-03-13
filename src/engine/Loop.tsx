import Rengine from "./engine";
import { FPS_LIMIT, LOOP_MODE, update } from "../Lifecycle";

let ANIMATION_FRAME: number = -1;

// This is a magic number, I do not know why, but the limiting will be inaccurate
// unless you multiply the limit by this ratio before checking (line 50) in canvas mode
const CANVAS_FRAME_LIMIT_RATIO = (4/3);

export let LAST_UPDATE: number = -1;
export let FRAMES_SINCE_STARTUP = 0;
let CLOCK: NodeJS.Timeout | null = null;

class EngineStateContainer {
  static lastState: EngineState;
}

export const StartGameLoop = ([state, render]: [EngineState, (es: EngineState) => any]) => {
  EngineStateContainer.lastState = state;
  if(LOOP_MODE === 'interval'){
    if(CLOCK === null){
      CLOCK = setInterval(() => {
        EngineStateContainer.lastState = DoFrame([EngineStateContainer.lastState, render]);
      }, 1000/FPS_LIMIT);
      EngineStateContainer.lastState = DoFrame([EngineStateContainer.lastState, render]);
    }
  } else if (LOOP_MODE === 'animation') {
    let cb: FrameRequestCallback = () => {
      let animFrameBefore = ANIMATION_FRAME;
      if(Date.now() - LAST_UPDATE < (1000 / (FPS_LIMIT * CANVAS_FRAME_LIMIT_RATIO))){
        ANIMATION_FRAME = window.requestAnimationFrame(cb);
        return;
      } else {
        EngineStateContainer.lastState = DoFrame([EngineStateContainer.lastState, render]);
        let animFrameAfter = ANIMATION_FRAME;
        if(animFrameAfter === -1 && animFrameBefore !== -1) return;
        ANIMATION_FRAME = window.requestAnimationFrame(cb);
      }
    };
    cb(-1);
  } else {
    throw new Error('No such LOOP_MODE called ' + LOOP_MODE + '!');
  }
};

export const EndGameLoop = () => {
  if(LOOP_MODE === 'interval'){
    if(CLOCK !== null){
      clearInterval(CLOCK);
      CLOCK = null;
    }
  } else if (LOOP_MODE === 'animation') {
    if(ANIMATION_FRAME !== -1){
      window.cancelAnimationFrame(ANIMATION_FRAME);
      ANIMATION_FRAME = -1;
    }
  } else {
    throw new Error('No such LOOP_MODE called ' + LOOP_MODE + '!');
  }
  LAST_UPDATE = -1;
  FRAMES_SINCE_STARTUP = 0;
};

const DoFrame = ([state, render]: [EngineState, (es: EngineState) => any]): EngineState => {
  EngineStateContainer.lastState = state;
  const currTimeMs = Date.now();
  const delta = (LAST_UPDATE === -1) ? 1 : currTimeMs - LAST_UPDATE;
  const newState = Rengine.Game.TickActiveScene(EngineStateContainer.lastState)(delta);
  const newState2 = update(delta, newState);
  render(newState2);
  LAST_UPDATE = currTimeMs;
  FRAMES_SINCE_STARTUP = FRAMES_SINCE_STARTUP + 1;
  return newState2;
}