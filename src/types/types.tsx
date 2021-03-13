export {};

declare global {
  export type Vector2 = {
    x: number;
    y: number;
  };

  type RenderingEngineOption = 'canvas' | 'react';
  type LoopMode = 'interval' | 'animation';

  type UpdateFunction = (delta: number, e: Entity, s: Scene, prevState: EngineState) => [Entity, EngineState];

  export type Component = {
    update: (delta: number, e: Entity, s: Scene, prevState: EngineState) => [Entity, EngineState];
  };

  export type Shader = (elt: JSX.Element, e: Entity) => JSX.Element;

  export type Render = (es: EngineState) => (e: Entity) => JSX.Element | any;

  export type EntityProps = {
    position: Vector2;
    // the position about which
    anchor: Vector2;
    // rotation in radians
    rotation: number;
    // X and Y scale
    scale: Vector2;
    // dimensions
    size: Dimensions;
  };

  export type Entity = {
    properties: EntityProps;
    components: Component[];
    render: Render;
    shaders: Shader[];
    uuid: string;
  };

  export type FolderEntity = Entity & { entities: Entity[] }

  export type Camera = {
    position: Vector2;
    size: Dimensions;
  };

  export type Dimensions = {
    height: number;
    width: number;
  };

  export type Texture = {
    url: string;
    size: Dimensions;
    alt: string;
  };

  export type Scene = {
    uuid: string;
    entities: Entity[];
  };

  export type Color = {
    r: number;
    g: number;
    b: number;
    a: number;
  };

  export type Transformation = {
    translation: Vector2,
    anchor: Vector2,
    finalPosition: Vector2,
    scale: Vector2,
    rotation: number,
  }

  export type OriginLocation = "center" | "topleft" | "bottomleft";

  export type GlobalConfig = {
    origin: OriginLocation;
    width: number;
    height: number;
  };

  export type BoundingBox = {
    minXminY: Vector2;
    minXmaxY: Vector2;
    maxXminY: Vector2;
    maxXmaxY: Vector2;
  };

  export type EngineState = {
    scenes: Scene[];
    activeScene: Scene | null;
    config: GlobalConfig;
    canvas: HTMLCanvasElement | null;
  };
}