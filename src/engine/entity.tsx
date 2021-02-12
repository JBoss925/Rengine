import React from 'react';
import { MathUtil, Vec2 } from "./engine";

let entityID: number = 0;

export class Entities {

  static MakeEntity = (
    props: EntityProps,
    components: Component[],
    render: Render,
    shaders: Shader[]
  ): Entity => {
    entityID++;
    return {
      uuid: String(entityID),
      properties: props,
      components: components,
      render: render,
      shaders: shaders,
    };
  };

  static GetEntityOrigin = (es: EngineState) => (e: Entity): Vector2 => {
    let origin: Vector2;
    if (es.config.origin === "center") {
      origin = e.properties.position;
    } else if (es.config.origin === "topleft") {
      origin = {
        x:
          e.properties.position.x -
          (e.properties.scale.x * e.properties.size.width) / 2,
        y:
          e.properties.position.y +
          (e.properties.scale.y * e.properties.size.height) / 2,
      };
    } else if (es.config.origin === "bottomleft") {
      origin = {
        x:
          e.properties.position.x -
          (e.properties.scale.x * e.properties.size.width) / 2,
        y:
          e.properties.position.y -
          (e.properties.scale.y * e.properties.size.height) / 2,
      };
    } else {
      throw new Error("No such origin location option: " + es.config.origin);
    }
    return origin;
  };

  static GetEntityBBOrigin = (es: EngineState) => (e: Entity): Vector2 => {
    const eBB = Entities.ComputeEntityBoundingBox(es)(e);
    let newOriginPos: Vector2;
    if (es.config.origin === "center") {
      newOriginPos = { x: (eBB.minXminY.x + eBB.maxXmaxY.x) / 2, y: (eBB.minXminY.y + eBB.maxXmaxY.y) / 2 };
    } else if (es.config.origin === "topleft") {
      newOriginPos = eBB.minXmaxY;
    } else if (es.config.origin === "bottomleft") {
      newOriginPos = eBB.minXminY;
    } else {
      throw new Error("No such origin location: " + es.config.origin);
    }
    return newOriginPos;
  }

  static MakeFolderEntity = (state: EngineState) => (
    entities: Entity[]
  ): Entity => {
    let bounds: BoundingBox[] = entities.map((e) =>
      Entities.ComputeEntityBoundingBox(state)(e)
    );
    let minX = bounds.reduce((pr, cu) => {
      if (cu.minXminY.x < pr.minXminY.x) {
        return cu;
      } else {
        return pr;
      }
    }, bounds[0]).minXminY.x;
    let minY = bounds.reduce((pr, cu) => {
      if (cu.minXminY.y < pr.minXminY.y) {
        return cu;
      } else {
        return pr;
      }
    }, bounds[0]).minXminY.y;
    let maxX = bounds.reduce((pr, cu) => {
      if (cu.maxXmaxY.x > pr.maxXmaxY.x) {
        return cu;
      } else {
        return pr;
      }
    }, bounds[0]).maxXmaxY.x;
    let maxY = bounds.reduce((pr, cu) => {
      if (cu.maxXmaxY.y > pr.maxXmaxY.y) {
        return cu;
      } else {
        return pr;
      }
    }, bounds[0]).maxXmaxY.y;
    let newOriginPos: Vector2;
    if (state.config.origin === "center") {
      newOriginPos = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    } else if (state.config.origin === "topleft") {
      newOriginPos = { x: minX, y: maxY };
    } else if (state.config.origin === "bottomleft") {
      newOriginPos = { x: minX, y: minY };
    } else {
      throw new Error("No such origin location: " + state.config.origin);
    }
    entityID++;
    return {
      uuid: String(entityID),
      properties: {
        position: newOriginPos,
        scale: { x: 1, y: 1 },
        rotation: 0,
        size: { width: maxX - minX, height: maxY - minY },
      },
      components: [],
      shaders: [],
      render: (e) => {
        let vals = entities.map((a) => { return { 
          ...a,
          properties: {
            ...a.properties,
            position: Vec2.Sub(a.properties.position)(e.properties.position),
          }
        }
      }).map((a) => {
          return {
            ...a,
            properties: {
              ...a.properties,
              position: MathUtil.RotatePositionAboutPoint(e.properties.rotation)(Entities.GetEntityOrigin(state)(e))(Vec2.Add(a.properties.position)(e.properties.position)),
              scale: Vec2.Mul(a.properties.scale)(e.properties.scale),
              rotation: (a.properties.rotation + e.properties.rotation) % (2 * Math.PI),
            }
          };
        }).map((a) => a.render(a));
        return <>{vals}</>;
      },
    };
  };

  static ComputeEntityBoundingBox = (es: EngineState) => (
    e: Entity
  ): BoundingBox => {
    let origin: Vector2 = Entities.GetEntityOrigin(es)(e);
    let pointsToConsider: Vector2[] = [
      {
        x:
          e.properties.position.x -
          (e.properties.size.width * e.properties.scale.x) / 2,
        y:
          e.properties.position.y -
          (e.properties.size.height * e.properties.scale.y) / 2,
      },
      {
        x:
          e.properties.position.x -
          (e.properties.size.width * e.properties.scale.x) / 2,
        y:
          e.properties.position.y +
          (e.properties.size.height * e.properties.scale.y) / 2,
      },
      {
        x:
          e.properties.position.x +
          (e.properties.size.width * e.properties.scale.x) / 2,
        y:
          e.properties.position.y -
          (e.properties.size.height * e.properties.scale.y) / 2,
      },
      {
        x:
          e.properties.position.x +
          (e.properties.size.width * e.properties.scale.x) / 2,
        y:
          e.properties.position.y +
          (e.properties.size.height * e.properties.scale.y) / 2,
      },
    ].map(MathUtil.RotatePositionAboutPoint(e.properties.rotation)(origin));
  
    let minX = pointsToConsider.reduce((pr, cu) => {
      if (cu.x < pr.x) {
        return cu;
      } else {
        return pr;
      }
    }, pointsToConsider[0]).x;
    let minY = pointsToConsider.reduce((pr, cu) => {
      if (cu.y < pr.y) {
        return cu;
      } else {
        return pr;
      }
    }, pointsToConsider[0]).y;
    let maxX = pointsToConsider.reduce((pr, cu) => {
      if (cu.x > pr.x) {
        return cu;
      } else {
        return pr;
      }
    }, pointsToConsider[0]).x;
    let maxY = pointsToConsider.reduce((pr, cu) => {
      if (cu.y > pr.y) {
        return cu;
      } else {
        return pr;
      }
    }, pointsToConsider[0]).y;
  
    const bb: BoundingBox = {
      minXminY: { x: minX, y: minY },
      minXmaxY: { x: minX, y: maxY },
      maxXminY: { x: maxX, y: minY },
      maxXmaxY: { x: maxX, y: maxY },
    };
    return bb;
  };

}