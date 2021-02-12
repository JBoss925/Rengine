import { AnimationEngine } from "./component/animation/engine";
import Rengine, { Vec2 } from "./engine/engine";
import { EndGameLoop } from "./Loop";

export const init = (canvas?: HTMLCanvasElement): EngineState => {
  let engineState = Rengine.Game.InitEngine(undefined, canvas);
  engineState = Rengine.Scene.CreateScene(engineState)('root', true);
  baseEntity = Rengine.Entity.MakeEntity(
    {
      position: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (delta, e, s, ps) => {
        let newEnt = e;
        newEnt.properties.rotation = (newEnt.properties.position.x / 20) % (2 * Math.PI);
        newEnt.properties.scale = Vec2.Add(newEnt.properties.scale)({x:0.03,y:0.03})
        return [newEnt, ps];
      },
    },
    AnimationEngine.PositionAnimationComponent
      ((x,y) => { return x + 2.5 })
      ((x,y) => { return Math.pow(x / 6, 1.5) })()()
  ],
    Rengine.Renderer.BoxRenderer(engineState)({ r: 255, g: 0, b: 0, a: 1 }),
    []
  );
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(baseEntity);
  return engineState;
}

let baseEntity: Entity;

let timePassed = 0;

let memo = false;

export const update = (delta: number, es: EngineState): EngineState => {
  timePassed += delta;
  if(memo && timePassed > 6000){
    console.log('ended!');
    EndGameLoop();
  }
  if(memo || timePassed > 3000){
    memo = true;
    return Rengine.Scene.RemoveEntityFromScene(es)('root')(baseEntity);
  }
  return es;
}