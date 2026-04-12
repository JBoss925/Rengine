import Rengine, { Colors } from "../engine/engine";
import { AnimationFactory } from "../components/animation/engine";

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
  return {
    primary: hexToColor("#8d7bff"),
    secondary: hexToColor("#5ad7ff"),
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

function createSquarePathComponent(
  center: Vector2,
  halfExtent: number,
  loopsPerSecond: number
): Component {
  let progress = 0;
  const corners: Vector2[] = [
    { x: center.x - halfExtent, y: center.y - halfExtent },
    { x: center.x + halfExtent, y: center.y - halfExtent },
    { x: center.x + halfExtent, y: center.y + halfExtent },
    { x: center.x - halfExtent, y: center.y + halfExtent }
  ];

  return createComponent(`square-path ${loopsPerSecond.toFixed(2)}l/s`, (delta, entity, scene, prevState) => {
    progress = (progress + (delta / 1000) * loopsPerSecond) % 1;
    const edgeProgress = progress * corners.length;
    const edgeIndex = Math.floor(edgeProgress);
    const local = edgeProgress - edgeIndex;
    const start = corners[edgeIndex];
    const end = corners[(edgeIndex + 1) % corners.length];

    entity.properties.position = {
      x: start.x + (end.x - start.x) * local,
      y: start.y + (end.y - start.y) * local
    };

    return [entity, prevState];
  });
}

function createStarPathComponent(
  center: Vector2,
  radius: number,
  loopsPerSecond: number
): Component {
  let progress = 0;
  const outerPoints: Vector2[] = Array.from({ length: 5 }, (_, index) => {
    const angle = -Math.PI / 2 + index * ((2 * Math.PI) / 5);
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  });
  const starOrder = [0, 2, 4, 1, 3];
  const path: Vector2[] = starOrder.map((pointIndex) => outerPoints[pointIndex]);

  return createComponent(`star-path ${loopsPerSecond.toFixed(2)}l/s`, (delta, entity, scene, prevState) => {
    progress = (progress + (delta / 1000) * loopsPerSecond) % 1;
    const edgeProgress = progress * path.length;
    const edgeIndex = Math.floor(edgeProgress);
    const local = edgeProgress - edgeIndex;
    const start = path[edgeIndex];
    const end = path[(edgeIndex + 1) % path.length];

    entity.properties.position = {
      x: start.x + (end.x - start.x) * local,
      y: start.y + (end.y - start.y) * local
    };

    return [entity, prevState];
  });
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

function createStackedOrbitSquareScene(engineStateIn: EngineState): EngineState {
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

function createCounterDriftSquareScene(engineStateIn: EngineState): EngineState {
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

function createLayeredMotionStackScene(engineStateIn: EngineState): EngineState {
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

function createDiagonalSweepArrayScene(engineStateIn: EngineState, amount = 20): EngineState {
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

function createLocalPivotArrayScene(engineStateIn: EngineState, amount = 20): EngineState {
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

function createLateJoinerTimingScene(engineStateIn: EngineState): EngineState {
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

function createMirroredDuoScene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  const leftSquare = createBox(
    engineState,
    {
      position: { x: -90, y: 40 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(1, 0.8)],
    demoColors.cube,
    "Left Square"
  );

  const rightSquare = createBox(
    engineState,
    {
      position: { x: 90, y: -40 },
      anchor: { x: 0, y: 0 },
      size: { width: 50, height: 50 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(-1, 0.8)],
    demoColors.secondary,
    "Right Square"
  );

  const rootGroup = createFolder(engineState, [leftSquare, rightSquare], "Mirrored Pair");
  rootGroup.components.push(createRotationComponent(1, 0.35));
  engineState = addEntityToRoot(engineState, rootGroup);
  return engineState;
}

function createNestedSpiralScene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  let chain: Entity = createBox(
    engineState,
    {
      position: { x: 60, y: 60 },
      anchor: { x: 0, y: 0 },
      size: { width: 42, height: 42 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(-1, 1.4)],
    demoColors.cube,
    "Spiral Tip"
  );

  const rates = [0.9, 0.7, 0.5, 0.35];
  rates.forEach((rate, index) => {
    const wrapper = createFolder(engineState, [chain], `Spiral Pivot ${index + 1}`);
    wrapper.properties.position = { x: 80, y: 35 + index * 10 };
    wrapper.components.push(createRotationComponent(1, rate));
    chain = wrapper;
  });

  engineState = addEntityToRoot(engineState, chain);
  return engineState;
}

function createOffsetWaveScene(engineStateIn: EngineState, amount = 12): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  for (let index = 0; index < amount; index += 1) {
    const direction: 1 | -1 = index % 2 === 0 ? 1 : -1;
    const square = createBox(
      engineState,
      {
        position: { x: -190 + index * 34, y: -20 + (index % 2 === 0 ? 26 : -26) },
        anchor: { x: 0, y: 0 },
        size: { width: 32, height: 32 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createRotationComponent(direction, 0.7)],
      index % 2 === 0 ? demoColors.cube : demoColors.primary,
      `Wave Square ${index + 1}`
    );
    engineState = addEntityToRoot(engineState, square);
  }

  return engineState;
}

function createPathShowcaseScene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const demoColors = getDemoColors(engineState);

  const squareMarcher = createBox(
    engineState,
    {
      position: { x: -140, y: -140 },
      anchor: { x: 0, y: 0 },
      size: { width: 36, height: 36 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createSquarePathComponent({ x: 0, y: 0 }, 150, 0.12), createRotationComponent(1, 1.2)],
    demoColors.primary,
    "Square Marcher"
  );

  const starRunner = createBox(
    engineState,
    {
      position: { x: 0, y: -170 },
      anchor: { x: 0, y: 0 },
      size: { width: 34, height: 34 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createStarPathComponent({ x: 0, y: 0 }, 170, 0.2), createRotationComponent(-1, 1.6)],
    hexToColor("#ff5b6f"),
    "Star Runner"
  );

  const orbitCompanion = createBox(
    engineState,
    {
      position: { x: 75, y: 0 },
      anchor: { x: 0, y: 0 },
      size: { width: 30, height: 30 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(1, 1.8)],
    demoColors.cube,
    "Orbit Companion"
  );

  const orbitPivot = createFolder(engineState, [orbitCompanion], "Orbit Pivot");
  orbitPivot.components.push(createRotationComponent(1, 0.45));

  const centerSpinner = createBox(
    engineState,
    {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      size: { width: 56, height: 56 },
      rotation: 0,
      scale: { x: 1, y: 1 }
    },
    [createRotationComponent(-1, 0.9)],
    hexToColor("#3bd3ff"),
    "Center Spinner"
  );

  [squareMarcher, starRunner, orbitPivot, centerSpinner].forEach((entity) => {
    engineState = addEntityToRoot(engineState, entity);
  });

  return engineState;
}

function createPathGridFestivalScene(engineStateIn: EngineState): EngineState {
  let engineState = engineStateIn;
  const festivalColors = [
    { march: hexToColor("#ff5f6d"), star: hexToColor("#2ec4b6"), pivot: hexToColor("#ffd166") },
    { march: hexToColor("#8b5cf6"), star: hexToColor("#f72585"), pivot: hexToColor("#80ed99") },
    { march: hexToColor("#4cc9f0"), star: hexToColor("#ff9f1c"), pivot: hexToColor("#b8f2e6") }
  ];

  for (let index = 0; index < 3; index += 1) {
    const offsetX = -180 + index * 180;
    const laneColors = festivalColors[index];
    const marcher = createBox(
      engineState,
      {
        position: { x: offsetX - 50, y: -90 },
        anchor: { x: 0, y: 0 },
        size: { width: 28, height: 28 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createSquarePathComponent({ x: offsetX, y: 0 }, 60, 0.16 + index * 0.03), createRotationComponent(1, 1.1)],
      laneColors.march,
      `Marcher ${index + 1}`
    );

    const starling = createBox(
      engineState,
      {
        position: { x: offsetX, y: -70 },
        anchor: { x: 0, y: 0 },
        size: { width: 24, height: 24 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createStarPathComponent({ x: offsetX, y: 0 }, 78, 0.18 + index * 0.02), createRotationComponent(-1, 1.4)],
      laneColors.star,
      `Starling ${index + 1}`
    );

    const pivotChild = createBox(
      engineState,
      {
        position: { x: 50, y: 0 },
        anchor: { x: 0, y: 0 },
        size: { width: 20, height: 20 },
        rotation: 0,
        scale: { x: 1, y: 1 }
      },
      [createRotationComponent(1, 1.8)],
      laneColors.pivot,
      `Pivot Child ${index + 1}`
    );

    const pivot = createFolder(engineState, [pivotChild], `Pivot ${index + 1}`);
    pivot.properties.position = { x: offsetX, y: 0 };
    pivot.components.push(createRotationComponent(index % 2 === 0 ? 1 : -1, 0.4 + index * 0.1));

    [marcher, starling, pivot].forEach((entity) => {
      engineState = addEntityToRoot(engineState, entity);
    });
  }

  return engineState;
}

export const rengineDemos: RuntimeDemoDefinition[] = [
  {
    id: "demoPathShowcase",
    title: "Path Choreography",
    description: "Square marcher and star runner move on distinct paths while companions orbit and spin in same scene.",
    summary: "Path-focused composite scene: one traces square loop, one follows star, others add layered context.",
    createScene: createPathShowcaseScene
  },
  {
    id: "demoPathGridFestival",
    title: "Path Grid Festival",
    description: "Three-lane choreography mixes multiple square-path marchers and star-path followers with rotating pivots.",
    summary: "Most complex multi-entity path scene in set, good stress test for update layering and readability.",
    createScene: createPathGridFestivalScene
  },
  {
    id: "demoOffsetWave",
    title: "Offset Wave Line",
    description: "Alternating squares spin in opposite directions across a staggered line to create a wave rhythm.",
    summary: "Useful for scanning per-entity variation while keeping scene layout simple and readable.",
    createScene: (engineState) => createOffsetWaveScene(engineState, 12)
  },
  {
    id: "demoStackedOrbitSquare",
    title: "Stacked Orbit Square",
    description: "Three parent pivots stack together to orbit one square through a compound transform chain.",
    summary: "Shows how position and rotation compound when one square inherits motion from several parents.",
    createScene: createStackedOrbitSquareScene
  },
  {
    id: "demoCounterDriftSquare",
    title: "Counter Drift Square",
    description: "A square counter-rotates while its parent drifts, creating a tug-of-war between local and inherited motion.",
    summary: "Highlights how local updates can cancel inherited movement when the scene graph is layered.",
    createScene: createCounterDriftSquareScene
  },
  {
    id: "demoLayeredMotionStack",
    title: "Layered Motion Stack",
    description: "Two animated parent folders and one fast child square produce a dense, high-energy hierarchy.",
    summary: "This is the busiest transform stack and gives the clearest feel for scene-graph composition under motion.",
    createScene: createLayeredMotionStackScene
  },
  {
    id: "demoDiagonalSweepArray",
    title: "Diagonal Sweep Array",
    description: "A diagonal array of squares rotates independently while preserving a clean marching offset.",
    summary: "Useful for seeing repeated entities share a renderer while keeping independent local transforms.",
    createScene: (engineState) => createDiagonalSweepArrayScene(engineState, 20)
  },
  {
    id: "demoLocalPivotArray",
    title: "Local Pivot Array",
    description: "Each square rotates around its own anchor instead of the scene center.",
    summary: "Makes anchor behavior obvious because every square spins around its own local pivot.",
    createScene: (engineState) => createLocalPivotArrayScene(engineState, 20)
  },
  {
    id: "demoLateJoinerTiming",
    title: "Late Joiner Timing",
    description: "A timing-focused scene starts with one square, then adds another after the loop has already been running.",
    summary: "Illustrates frame-based updates and how scene state changes once enough ticks have elapsed.",
    createScene: createLateJoinerTimingScene,
    tick: (runtime) => {
      if (!runtime.metadata.secondBoxAdded && runtime.framesSinceStartup > 120) {
        runtime.metadata.secondBoxAdded = true;
        addSecondBox(runtime);
      }
    }
  },
  {
    id: "demoMirroredDuo",
    title: "Mirrored Duo",
    description: "Two counter-rotating squares orbit as a mirrored pair under one shared parent pivot.",
    summary: "Good quick read of symmetry: opposite local spins, same inherited parent motion.",
    createScene: createMirroredDuoScene
  },
  {
    id: "demoNestedSpiral",
    title: "Nested Spiral Chain",
    description: "A chain of pivots with descending rotation rates forms a smooth spiral-like transfer of motion.",
    summary: "Shows how deeper parent chains reshape a child trajectory even with simple per-node updates.",
    createScene: createNestedSpiralScene
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
