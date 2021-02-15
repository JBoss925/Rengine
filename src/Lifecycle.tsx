import Rengine, { Colors } from "./engine/engine";
import { EndGameLoop } from "./engine/Loop";

export const init = (canvas?: HTMLCanvasElement): EngineState => {
  let engineState = Rengine.Game.InitEngine(undefined, canvas);
  engineState = Rengine.Scene.CreateScene(engineState)('root', true);
  let baseEntity = Rengine.Entity.MakeEntity(
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + ((d/1000) * Math.PI / 2); return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  let folder = Rengine.Entity.MakeFolderEntity(engineState)([baseEntity], true);
  folder.components.push({
    update: (d, e, s, ps) => {
      return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation }}, ps];
    }
  });
  let folder2 = Rengine.Entity.MakeFolderEntity(engineState)([folder]);
  folder2.components.push({
    update: (d, e, s, ps) => {
      return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + ((d/1000) * Math.PI / 2) }}, ps];
    }
  });
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder2);
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