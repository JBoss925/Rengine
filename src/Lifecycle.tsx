import Rengine, { Colors } from "./engine/engine";
import { EndGameLoop } from "./engine/Loop";

export const init = (canvas?: HTMLCanvasElement): EngineState => {
  let engineState = Rengine.Game.InitEngine(undefined, canvas);
  engineState = Rengine.Scene.CreateScene(engineState)('root', true);
  baseEntity = Rengine.Entity.MakeEntity(
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + 0.01; return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  let folder = Rengine.Entity.MakeFolderEntity(engineState)([baseEntity]);
  folder.components.push({
    update: (d, e, s, ps) => {
      return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation }}, ps];
    }
  });
  folder.properties.position = { x: 200, y: 0 };
  folder.properties.anchor = { x: 0, y: 0 };
  let folder2 = Rengine.Entity.MakeFolderEntity(engineState)([folder]);
  folder2.components.push({
    update: (d, e, s, ps) => {
      return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + 0.01 }}, ps];
    }
  });
  folder2.properties.position = { x: 100, y: 0 };
  folder2.properties.anchor = { x: 0, y: 0 };
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder2);
  // engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder2);
  return engineState;
}

let baseEntity: Entity;

let timePassed = 0;

let memo = false;

export const update = (delta: number, es: EngineState): EngineState => {
  timePassed += delta;
  if(memo && timePassed > 20000){
    EndGameLoop();
  }
  if(memo || timePassed > 5000){
    memo = true;
    return es;
    // return Rengine.Scene.RemoveEntityFromScene(es)('root')(baseEntity);
  }
  return es;
}