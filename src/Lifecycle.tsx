import Rengine, { Colors } from "./engine/engine";
import { EndGameLoop, FRAMES_SINCE_STARTUP } from "./engine/Loop";
import { AnimationFactory } from './components/animation/engine';

/**
 * Welcome to the dev sesh! Here's a quick overview of what each
 * of the global config variables do.
 * 
 * Rendering Engine:
 * Whether to render elements with react or just the canvas.
 * 
 * Loop Mode:
 * Whether the frames draw on a clock interval or request animation frames.
 * 
 * 
 * Transformation Points Key:
 * 
 * Blue Square --> entity position
 * Red Square --> entity anchor
 * Black Line --> connects paired entities' anchors to their positions
 * 
 * 
 * FPS Limit:
 * The maximum FPS mathematically possible assuming no lag.
 */

export const RENDERING_ENGINE: RenderingEngineOption = 'canvas';
export const LOOP_MODE: LoopMode = 'animation';
export const SHOW_TRANSFORMATION_POINTS: boolean = false;
export const FPS_LIMIT = 60;

export const init = (canvas?: HTMLCanvasElement): EngineState => {
  let engineState = Rengine.Game.InitEngine(undefined, canvas);
  engineState = Rengine.Scene.CreateScene(engineState)('root', true);
  
  return demoPurpleCube1(engineState);
  // return demoPurpleCube2(engineState);
  // return demoPurpleCube3(engineState);
  // return demoMultiCubeInLine(engineState, 20);
  // return demoMultiCubeInPlace(engineState, 20);
  // return demoTimeDif(engineState);
}

let timePassed = 0;
let secondBoxAdded = false;

export const update = (delta: number, es: EngineState): EngineState => {
  timePassed += delta;
  if(!secondBoxAdded && 
    FRAMES_SINCE_STARTUP > 120
    // timePassed > 2000
    // why is timePassed > 2000 better for syncing?
    ){
    secondBoxAdded = true;
    // NOTE: This return statement is for demoTimeDif
    // return addSecondBox(es);
  }
  if(timePassed > 20000){
    EndGameLoop();
  }
  return es;
}

















// DEMO CODE BEGIN -------------------------------------------------------------
//
// DEMO CODE BEGIN -------------------------------------------------------------
//
// DEMO CODE BEGIN -------------------------------------------------------------
//
// DEMO CODE BEGIN -------------------------------------------------------------

// eslint-disable-next-line
const demoPurpleCube1 = (engineStateIn: EngineState): EngineState => {
  let engineState = engineStateIn;
  // Make our box
  let box = Rengine.Entity.MakeEntity(
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + (0.4 * (d/1000) * Math.PI); return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  // Make the first rotating parent
  let folder = Rengine.Entity.MakeFolderEntity(engineState)([box]);
  folder.properties.position = { x: 100, y: 100 };
  folder.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + (0.4 * (d/1000) * Math.PI) }}, ps];
    }
  });
  // Make the second rotating parent
  let folder2 = Rengine.Entity.MakeFolderEntity(engineState)([folder]);
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + (0.4 * (d/1000) * Math.PI) }}, ps];
    }
  });
  // Make the second rotating parent
  let folder3 = Rengine.Entity.MakeFolderEntity(engineState)([folder2]);
  folder3.properties.position = { x: 100, y: 100 };
  folder3.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + (0.4 * (d/1000) * Math.PI) }}, ps];
    }
  });
  // Add the second parent to the scene, adding all entities by extension
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder3);
  return engineState;
}

// This cube stays "in place" because we are counter-rotating its parent now
// eslint-disable-next-line
const demoPurpleCube2 = (engineStateIn: EngineState): EngineState => {
  let engineState = engineStateIn;
  // Make our box
  let box = Rengine.Entity.MakeEntity(
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation - ((d/1000) * Math.PI); return [e, ps]; }
    }, AnimationFactory.PositionAnimationComponent((d, x, y) => x + 10 * d / 1000)((d, x, y) => y + 10 * d / 1000)()()],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  // Make the first rotating parent
  let folder = Rengine.Entity.MakeFolderEntity(engineState)([box]);
  folder.properties.position = { x: 100, y: 100 };
  // Make the second rotating parent
  let folder2 = Rengine.Entity.MakeFolderEntity(engineState)([folder]);
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + ((d/1000) * Math.PI) }}, ps];
    }
  },
  AnimationFactory.PositionAnimationComponent((d, x, y) => x - 25 * d / 1000)((d, x, y) => y - 25 * d / 1000)()()
  );
  // Add the second parent to the scene, adding all entities by extension
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder2);
  return engineState;
}

// eslint-disable-next-line
const demoPurpleCube3 = (engineStateIn: EngineState): EngineState => {
  let engineState = engineStateIn;
  // Make our box
  let box = Rengine.Entity.MakeEntity(
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation - (3 * (d/1000) * Math.PI); return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  // Make the first rotating parent
  let folder = Rengine.Entity.MakeFolderEntity(engineState)([box]);
  folder.properties.position = { x: 100, y: 100 };
  folder.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + ((d/1000) * Math.PI) }}, ps];
    }
  },
  AnimationFactory.PositionAnimationComponent((d, x, y) => x - 25 * d / 1000)((d, x, y) => y - 25 * d / 1000)()()
  );
  // Make the second rotating parent
  let folder2 = Rengine.Entity.MakeFolderEntity(engineState)([folder]);
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(
    {
      update: (d, e, s, ps) => {
        return [{ ...e, properties: { ...e.properties, rotation: e.properties.rotation + ((d/1000) * Math.PI) }}, ps];
    }
  },
  AnimationFactory.PositionAnimationComponent((d, x, y) => x - 25 * d / 1000)((d, x, y) => y - 25 * d / 1000)()()
  );
  // Add the second parent to the scene, adding all entities by extension
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(folder2);
  return engineState;
}

// eslint-disable-next-line
const demoMultiCubeInLine = (engineStateIn: EngineState, amount: number): EngineState => {
  let engineState = engineStateIn;
  for(let i = 0; i < amount; i++){
    // Make our box
    let box = Rengine.Entity.MakeEntity(
      {
        position: { x: i * 25, y: i * 25 },
        anchor: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [{
        update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + (0.3 * (d/1000) * Math.PI); return [e, ps]; }
      }],
      Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
      []
    );
    // Add the box to the scene
    engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(box);
  }
  return engineState;
}

// eslint-disable-next-line
const demoMultiCubeInPlace = (engineStateIn: EngineState, amount: number): EngineState => {
  let engineState = engineStateIn;
  for(let i = 0; i < amount; i++){
    // Make our box
    let box = Rengine.Entity.MakeEntity(
      {
        // NOTICE: ANCHOR = POSITION now, so our boxes won't rotate about center of screen,
        // but around their individual origins
        position: { x: i * 25, y: i * 25 },
        anchor: { x: i * 25, y: i * 25 },
        size: { width: 50, height: 50 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [{
        update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + ((d/1000) * Math.PI); return [e, ps]; }
      }],
      Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
      []
    );
    // Add the box to the scene
    engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(box);
  }
  return engineState;
}


// NOTE: demoTimeDif is called in init, while updateTimeDif is called in update
// eslint-disable-next-line
const demoTimeDif = (engineStateIn: EngineState): EngineState => {
  let engineState = engineStateIn;
  // Make our first box
  let box1 = Rengine.Entity.MakeEntity(
    {
      position: { x: 100, y: 100 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + ((d/1000) * Math.PI); return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(255, 0, 255, 1)),
    []
  );
  // Add the second parent to the scene, adding all entities by extension
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(box1);
  return engineState;
}

// eslint-disable-next-line
const addSecondBox = (engineStateIn: EngineState): EngineState => {
  let engineState = engineStateIn;
  // Make our second box
  let box2 = Rengine.Entity.MakeEntity(
    {
      position: { x: -100, y: -100 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [{
      update: (d, e, s, ps) => { e.properties.rotation = e.properties.rotation + ((d/1000) * Math.PI); return [e, ps]; }
    }],
    Rengine.Renderer.BoxRenderer(engineState)(Colors.rgbaToColor(0, 0, 255, 1)),
    []
  );
  // Add the second parent to the scene, adding all entities by extension
  engineState = Rengine.Scene.AddEntityToScene(engineState)('root')(box2);
  return engineState;
}