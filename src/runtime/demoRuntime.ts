import "../types/types";
import Rengine, { MathUtil, Vec2 } from "../engine/engine";
import { rengineDemos, applyDemoToEngineState, tickDemoRuntime, type DemoRuntimeState } from "./demos";

export type Vector2 = {
  x: number;
  y: number;
};

export type Dimensions = {
  width: number;
  height: number;
};

export type TransformProps = {
  position: Vector2;
  anchor: Vector2;
  rotation: number;
  scale: Vector2;
  size: Dimensions;
};

export type RuntimeTreeNode = {
  id: string;
  label: string;
  kind: "box" | "folder";
  color?: string;
  componentLabels: string[];
  local: TransformProps;
  world: TransformProps;
  children: RuntimeTreeNode[];
};

export type RuntimeScene = DemoRuntimeState & {
  demoId: string;
};

type EntityLike = Entity & {
  entities?: EntityLike[];
};

function cloneVector(vector: Vector2): Vector2 {
  return { x: vector.x, y: vector.y };
}

function cloneDimensions(dimensions: Dimensions): Dimensions {
  return { width: dimensions.width, height: dimensions.height };
}

function cloneTransform(properties: EntityProps): TransformProps {
  return {
    position: cloneVector(properties.position),
    anchor: cloneVector(properties.anchor),
    rotation: properties.rotation,
    scale: cloneVector(properties.scale),
    size: cloneDimensions(properties.size)
  };
}

function composeWorldTransform(properties: EntityProps, parent?: TransformProps): TransformProps {
  if (!parent) {
    return cloneTransform(properties);
  }

  const rotatedParentPosition = MathUtil.RotatePositionAboutPoint(-parent.rotation)(
    parent.anchor
  )(parent.position);

  return {
    position: Vec2.Add(properties.position)(rotatedParentPosition),
    anchor: Vec2.Add(properties.anchor)(rotatedParentPosition),
    rotation: (properties.rotation + parent.rotation) % (2 * Math.PI),
    scale: Vec2.Mul(properties.scale)(parent.scale),
    size: cloneDimensions(properties.size)
  };
}

function isFolderEntity(entity: EntityLike): entity is FolderEntity & EntityLike {
  return Array.isArray(entity.entities);
}

function createTreeNode(entity: EntityLike, parent?: TransformProps): RuntimeTreeNode {
  const world = composeWorldTransform(entity.properties, parent);

  return {
    id: entity.uuid,
    label: entity.label ?? (isFolderEntity(entity) ? "Folder" : "Box"),
    kind: isFolderEntity(entity) ? "folder" : "box",
    color: entity.debugColor,
    componentLabels: entity.components.map((component) => component.label ?? "update"),
    local: cloneTransform(entity.properties),
    world,
    children: isFolderEntity(entity)
      ? entity.entities.map((child) => createTreeNode(child, world))
      : []
  };
}

function getSceneRoot(runtime: RuntimeScene): RuntimeTreeNode {
  const activeScene = runtime.engineState.activeScene;

  if (!activeScene) {
    return {
      id: "root",
      label: "Root",
      kind: "folder",
      componentLabels: [],
      local: {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 },
        size: { width: 0, height: 0 }
      },
      world: {
        position: { x: 0, y: 0 },
        anchor: { x: 0, y: 0 },
        rotation: 0,
        scale: { x: 1, y: 1 },
        size: { width: 0, height: 0 }
      },
      children: []
    };
  }

  return {
    id: activeScene.uuid,
    label: "Root",
    kind: "folder",
    componentLabels: [],
    local: {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
      size: { width: 0, height: 0 }
    },
    world: {
      position: { x: 0, y: 0 },
      anchor: { x: 0, y: 0 },
      rotation: 0,
      scale: { x: 1, y: 1 },
      size: { width: 0, height: 0 }
    },
    children: activeScene.entities.map((entity) => createTreeNode(entity as EntityLike))
  };
}

export { rengineDemos };

export function createRuntimeScene(
  demoId: string,
  canvas?: HTMLCanvasElement,
  viewport?: Dimensions
): RuntimeScene {
  const runtimeCanvas =
    canvas ??
    (typeof document !== "undefined" ? document.createElement("canvas") : null) ??
    undefined;
  let engineState = Rengine.Game.InitEngine(
    {
      origin: "center",
      width: viewport?.width ?? window.innerWidth,
      height: viewport?.height ?? window.innerHeight,
      renderingEngine: "canvas",
      showTransformationPoints: true
    },
    runtimeCanvas
  );
  engineState = Rengine.Scene.CreateScene(engineState)("root", true);
  engineState = applyDemoToEngineState(engineState, demoId);

  return {
    demoId,
    engineState,
    elapsedMs: 0,
    framesSinceStartup: 0,
    metadata: {}
  };
}

export function getRuntimeTreeSnapshot(runtime: RuntimeScene): RuntimeTreeNode {
  return getSceneRoot(runtime);
}

export function advanceRuntimeScene(
  demoId: string,
  runtime: RuntimeScene,
  deltaMs: number
) {
  runtime.elapsedMs += deltaMs;
  runtime.framesSinceStartup += 1;
  runtime.engineState = Rengine.Game.TickActiveScene(runtime.engineState)(deltaMs);
  tickDemoRuntime(runtime, demoId, deltaMs);
}

export function renderRuntimeScene(
  _ctx: CanvasRenderingContext2D,
  runtime: RuntimeScene,
  viewport: Dimensions,
  showWireframes: boolean
) {
  const canvas = runtime.engineState.canvas;

  if (!canvas) {
    return;
  }

  runtime.engineState.config = {
    ...runtime.engineState.config,
    width: viewport.width,
    height: viewport.height,
    renderingEngine: "canvas",
    showTransformationPoints: showWireframes
  };

  const context = canvas.getContext("2d");

  if (!context) {
    return;
  }

  context.clearRect(0, 0, viewport.width, viewport.height);
  context.fillStyle = "#f8fbff";
  context.fillRect(0, 0, viewport.width, viewport.height);

  runtime.engineState.activeScene?.entities.forEach((entity) => {
    entity.render(runtime.engineState)(entity);
  });
}
