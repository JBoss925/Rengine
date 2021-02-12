import { Cameras } from "./camera";
import { Entities } from "./entity";
import { Games } from "./game";
import { Renderers, StyleConversions } from "./renderers";
import { Scenes } from "./scene";

const Rengine = {
  Camera: Cameras,
  Entity: Entities,
  Game: Games,
  Renderer: Renderers,
  Scene: Scenes,
  StyleConversion: StyleConversions,
};

export default Rengine;

export class Vec2 {
  static Add = (v1: Vector2) => (v2: Vector2) => { return { x: v1.x + v2.x, y: v1.y + v2.y } };
  static Sub = (v1: Vector2) => (v2: Vector2) => { return { x: v1.x - v2.x, y: v1.y - v2.y } };
  static Mul = (v1: Vector2) => (v2: Vector2) => { return { x: v1.x * v2.x, y: v1.y * v2.y } };
  static Div = (v1: Vector2) => (v2: Vector2) => { return { x: v1.x / v2.x, y: v1.y / v2.y } };
  static Neg = (v1: Vector2) => { return { x: -v1.x, y: -v1.y } };
}

export class Colors {
  static ColorToString = (c: Color): string => {
    return "rgba(" + c.r + "," + c.g + "," + c.b + "," + c.a + ")";
  };
}

export class MathUtil {
  static RotatePositionAboutPoint = (rad: number) => (about: Vector2) => (
    pos: Vector2
  ): Vector2 => {
    let cos = Math.cos(rad),
      sin = Math.sin(rad),
      run = about.x - pos.x,
      rise = about.y - pos.y,
      cx = cos * run + sin * rise + pos.x,
      cy = cos * rise - sin * run + pos.y;
    return {
      x: cx,
      y: cy,
    };
  };
}
