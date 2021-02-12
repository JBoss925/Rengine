import Rengine from "./engine/engine";
import { update } from "./Lifecycle";

export class MessageStream<T> {

  private cbs: Set<(t: T) => any> = new Set();

  listen(cb: (t: T) => any) {
    this.cbs.add(cb);
  }

  message(t: T) {
    this.cbs.forEach(cb => cb(t));
  }

  unlisten(cb: (t: T) => any) {
    this.cbs.delete(cb);
  }

}

type LOOP_MODE = 'interval' | 'animation';

let LOOP_MODE: LOOP_MODE = 'animation';
let ANIMATION_FRAME: number = -1;

export const RenderStream: MessageStream<EngineState> = new MessageStream<EngineState>();

export const FPS_LIMIT = 90;

export let LAST_UPDATE: number = -1;
let FRAMES_SINCE_STARTUP = 0;
let CLOCK: NodeJS.Timeout | null = null;

export const StartGameLoop = ([state, render]: [EngineState, (es: EngineState) => any]) => {
  let lastState = state;
  if(LOOP_MODE === 'interval'){
    if(CLOCK === null){
      CLOCK = setInterval(() => {
        lastState = DoFrame([lastState, render]);
      }, 1000/FPS_LIMIT);
      lastState = DoFrame([lastState, render]);
    }
  } else if (LOOP_MODE === 'animation') {
    let cb: FrameRequestCallback = () => {
      let animFrameBefore = ANIMATION_FRAME;
      lastState = DoFrame([state, render]);
      let animFrameAfter = ANIMATION_FRAME;
      if(animFrameAfter === -1 && animFrameBefore !== -1) return;
      ANIMATION_FRAME = window.requestAnimationFrame(cb);
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
  let lastState = state;
  if(LAST_UPDATE === -1){
    const currTimeMs = Date.now();
    const newState = Rengine.Game.TickActiveScene(lastState)(1);
    const newState2 = update(1, newState);
    render(newState2);
    lastState = newState2;
    LAST_UPDATE = currTimeMs;
    FRAMES_SINCE_STARTUP = FRAMES_SINCE_STARTUP + 1;
    return newState2;
  } else {
    const currTimeMs = Date.now();
    if(currTimeMs - LAST_UPDATE < (1000 / FPS_LIMIT)){
      return lastState;
    } else {
      const delta = currTimeMs - LAST_UPDATE;
      const newState = Rengine.Game.TickActiveScene(lastState)(delta);
      const newState2 = update(delta, newState);
      render(newState2);
      lastState = newState2;
      LAST_UPDATE = currTimeMs;
      FRAMES_SINCE_STARTUP = FRAMES_SINCE_STARTUP + 1;
      return newState2;
    }
  }
}