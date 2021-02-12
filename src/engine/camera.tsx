export class Cameras {

  static WorldToCameraCoords = (pos: Vector2, cam: Camera): Vector2 => {
    return {
      x: pos.x - cam.position.x,
      y: pos.y - cam.position.y,
    };
  };
  
  static CenterCameraOnVector2 = (pos: Vector2, cam: Camera): Camera => {
    return {
      ...cam,
      position: {
        x: pos.x - cam.size.width / 2,
        y: pos.y - cam.size.height / 2,
      },
    };
  };
  
}