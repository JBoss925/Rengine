import Rengine, { Colors } from "../engine/engine";
import { AnimationFactory } from "../components/animation/engine";
import { getWireframeColors } from "../engine/debugColors";

export type RuntimeDemoDefinition = {
  id: string;
  title: string;
  description: string;
  summary: string;
  createScene: (engineState: EngineState) => EngineState;
  tick?: (runtime: DemoRuntimeState, deltaMs: number) => void;
};

export type DemoRuntimeState = {
  engineState: EngineState;
  elapsedMs: number;
  framesSinceStartup: number;
  metadata: {
    secondBoxAdded?: boolean;
  };
};

type DemoColors = {
  primary: Color;
  secondary: Color;
  cube: Color;
};

function hexToColor(hex: string): Color {
  const normalized = hex.replace("#", "");
  const padded = normalized.length === 3
    ? normalized.split("").map((part) => `${part}${part}`).join("")
    : normalized;

  return {
    r: parseInt(padded.slice(0, 2), 16),
    g: parseInt(padded.slice(2, 4), 16),
    b: parseInt(padded.slice(4, 6), 16),
    a: 1
  };
}

function getDemoColors(engineState: EngineState): DemoColors {
  const wireframeColors = getWireframeColors(engineState.config);

  return {
    primary: hexToColor(wireframeColors.anchor),
    secondary: hexToColor(wireframeColors.position),
    cube: hexToColor("#4be3a9")
  };
}

function createComponent(
  label: string,
  update: Component["update"]
): Component {
  return { label, update };
}

function createRotationComponent(direction: 1 | -1, turnsPerSecond: number): Component {
  const signedTurns = `${direction > 0 ? "+" : "-"}${turnsPerSecond.toFixed(1)}pi/s`;

  return createComponent(`rotate ${signedTurns}`, (delta, entity, scene, prevState) => {
    entity.properties.rotation += direction * turnsPerSecond * (delta / 1000) * Math.PI;
    return [entity, prevState];
  });
}

function createVelocityComponent(xPerSecond: number, yPerSecond: number): Component {
  return {
    ...AnimationFactory.PositionAnimationComponent(
      (delta, x) => x + (xPerSecond * delta) / 1000
    )(
      (delta, _x, y) => y + (yPerSecond * delta) / 1000
    )()(),
    label: `velocity (${xPerSecond}, ${yPerSecond})`
  };
}

function createBox(
  engineState: EngineState,
  properties: EntityProps,
  components: Component[],
  color: Color,
  label: string
): Entity {
  const box = Rengine.Entity.MakeEntity(
    properties,
    components,
    Rengine.Renderer.BoxRenderer(engineState)(color),
    []
  );
  box.label = label;
  box.debugColor = Colors.ColorToString(color);
  return box;
}

function createFolder(
  engineState: EngineState,
  children: Entity[],
  label: string
): FolderEntity {
  const folder = Rengine.Entity.MakeFolderEntity(engineState)(children);
  folder.label = label;
  return folder;
}

function addEntityToRoot(engineState: EngineState, entity: Entity): EngineState {
  return Rengine.Scene.AddEntityToScene(engineState)("root")(entity);
}

function createPurpleCube1Scene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);
  const box = createBox(
    engineState,
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(1, 0.4)],
    demoColors.cube,
    "Cube"
  );
  const folder = createFolder(engineState, [box], "Inner Pivot");
  folder.properties.position = { x: 100, y: 100 };
  folder.components.push(createRotationComponent(1, 0.4));
  const folder2 = createFolder(engineState, [folder], "Middle Pivot");
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(createRotationComponent(1, 0.4));
  const folder3 = createFolder(engineState, [folder2], "Outer Pivot");
  folder3.properties.position = { x: 100, y: 100 };
  folder3.components.push(createRotationComponent(1, 0.4));
  engineState = addEntityToRoot(engineState, folder3);
  return engineState;
}

function createPurpleCube2Scene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);
  const box = createBox(
    engineState,
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(-1, 1), createVelocityComponent(10, 10)],
    demoColors.cube,
    "Counter-Rotating Cube"
  );
  const folder = createFolder(engineState, [box], "Parent Pivot");
  folder.properties.position = { x: 100, y: 100 };
  const folder2 = createFolder(engineState, [folder], "Moving Pivot");
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(createRotationComponent(1, 1), createVelocityComponent(-25, -25));
  engineState = addEntityToRoot(engineState, folder2);
  return engineState;
}

function createPurpleCube3Scene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);
  const box = createBox(
    engineState,
    {
      position: { x: 50, y: 50 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(-1, 3)],
    demoColors.cube,
    "Fast Cube"
  );
  const folder = createFolder(engineState, [box], "Inner Moving Pivot");
  folder.properties.position = { x: 100, y: 100 };
  folder.components.push(createRotationComponent(1, 1), createVelocityComponent(-25, -25));
  const folder2 = createFolder(engineState, [folder], "Outer Moving Pivot");
  folder2.properties.position = { x: 100, y: 100 };
  folder2.components.push(createRotationComponent(1, 1), createVelocityComponent(-25, -25));
  engineState = addEntityToRoot(engineState, folder2);
  return engineState;
}

function createMultiCubeInLineScene(engineStateIn: EngineState, amount = 20): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  for (let index = 0; index < amount; index += 1) {
    const box = createBox(
      engineState,
      {
        position: { x: index * 25, y: index * 25 },
        anchor: { x: 0, y: 0 },
        size: { width: 50, height: 50 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createRotationComponent(1, 0.3)],
      demoColors.cube,
      `Cube ${index + 1}`
    );
    engineState = addEntityToRoot(engineState, box);
  }

  return engineState;
}

function createMultiCubeInPlaceScene(engineStateIn: EngineState, amount = 20): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  for (let index = 0; index < amount; index += 1) {
    const box = createBox(
      engineState,
      {
        position: { x: index * 25, y: index * 25 },
        anchor: { x: index * 25, y: index * 25 },
        size: { width: 50, height: 50 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createRotationComponent(1, 1)],
      demoColors.cube,
      `Local Pivot Cube ${index + 1}`
    );
    engineState = addEntityToRoot(engineState, box);
  }

  return engineState;
}

function createTimeDifScene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);
  const box = createBox(
    engineState,
    {
      position: { x: 100, y: 100 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(1, 1)],
    demoColors.cube,
    "Primary Box"
  );
  engineState = addEntityToRoot(engineState, box);
  return engineState;
}

function addSecondBox(runtime: DemoRuntimeState) {
  const demoColors = getDemoColors(runtime.engineState);
  const box = createBox(
    runtime.engineState,
    {
      position: { x: -100, y: -100 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(1, 1)],
    hexToColor("#9353db"),
    "Late Box"
  );
  runtime.engineState = addEntityToRoot(runtime.engineState, box);
}

export const rengineDemos: RuntimeDemoDefinition[] = [
  {
    id: "demoPurpleCube1",
    title: "Purple Cube 1",
    description: "Nested rotating parents spin a single cube through a stacked transform chain.",
    summary: "Shows how position and rotation compound when one entity inherits motion from several parents.",
    createScene: createPurpleCube1Scene
  },
  {
    id: "demoPurpleCube2",
    title: "Purple Cube 2",
    description: "A child counter-rotates while its parent drifts, keeping the shape visually steadier than expected.",
    summary: "Highlights how local motion can cancel inherited movement when update rules are composed carefully.",
    createScene: createPurpleCube2Scene
  },
  {
    id: "demoPurpleCube3",
    title: "Purple Cube 3",
    description: "Two animated folders and a fast-spinning child produce the most layered transform stack in the set.",
    summary: "This is the densest hierarchy demo and gives the clearest feel for scene-graph style composition.",
    createScene: createPurpleCube3Scene
  },
  {
    id: "demoMultiCubeInLine",
    title: "Multi Cube In Line",
    description: "A line of cubes rotates independently while stepping diagonally across the scene.",
    summary: "Useful for seeing how repeated entities behave when they share the same renderer but not the same transform state.",
    createScene: (engineState) => createMultiCubeInLineScene(engineState, 20)
  },
  {
    id: "demoMultiCubeInPlace",
    title: "Multi Cube In Place",
    description: "Each cube rotates around its own origin instead of the scene center.",
    summary: "Makes the anchor setting easy to understand because every box spins around its own local pivot.",
    createScene: (engineState) => createMultiCubeInPlaceScene(engineState, 20)
  },
  {
    id: "demoTimeDif",
    title: "Time Dif",
    description: "A timing-focused scene starts with one box, then introduces a second box after the loop has been running.",
    summary: "This illustrates frame-based updates and shows how the scene changes once enough ticks have elapsed.",
    createScene: createTimeDifScene,
    tick: (runtime) => {
      if (!runtime.metadata.secondBoxAdded && runtime.framesSinceStartup > 120) {
        runtime.metadata.secondBoxAdded = true;
        addSecondBox(runtime);
      }
    }
  }
];

export function applyDemoToEngineState(engineState: EngineState, demoId: string): EngineState {
  const demo = rengineDemos.find((entry) => entry.id === demoId) ?? rengineDemos[0];
  return demo.createScene(engineState);
}

export function tickDemoRuntime(runtime: DemoRuntimeState, demoId: string, deltaMs: number) {
  const demo = rengineDemos.find((entry) => entry.id === demoId);
  demo?.tick?.(runtime, deltaMs);
}
