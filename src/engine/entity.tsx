import React from 'react';
import { RENDERING_ENGINE, SHOW_TRANSFORMATION_POINTS } from '..';
import { MathUtil, Vec2 } from "./engine";
import { StyleConversions } from './renderers';

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
  ): FolderEntity => {
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
    let newOriginPos: Vector2 = { x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
    const applyFolderTransformation = (e: FolderEntity, ents: Entity[]): Entity[] => {
      return ents.map((a) => {
        const v = {
          ...a,
          properties: {
            ...a.properties,
            position: MathUtil.RotatePositionAboutPoint(e.properties.rotation)(e.properties.anchor)(Vec2.Add(a.properties.position)(e.properties.position)),
            anchor: MathUtil.RotatePositionAboutPoint(e.properties.rotation)(e.properties.anchor)(Vec2.Add(a.properties.anchor)(e.properties.position)),
            scale: Vec2.Mul(a.properties.scale)(e.properties.scale),
            rotation: ((a.properties.rotation + e.properties.rotation) % (2 * Math.PI)),
          }
        };
        return v;
      });
    }
    entityID++;
    let ret: FolderEntity = {
      uuid: String(entityID),
      entities: entities,
      properties: {
        position: newOriginPos,
        anchor: newOriginPos,
        scale: { x: 1, y: 1 },
        rotation: 0,
        size: { width: maxX - minX, height: maxY - minY },
      },
      components: [{
        update: (delta, ent, s, ps) => {
          let newState = ps;
          let e = ent as FolderEntity;
          e.entities = e.entities.map((a) => {
            const finComp = a.components.reduce(([pe, pns], c) => {
              return c.update(delta, pe, s, pns);
            }, [a, newState] as [Entity, EngineState]);
            newState = finComp[1];
            return finComp[0];
          });
          return [e, newState];
        }
      }],
      shaders: [],
      render: (es: EngineState) => (ent: Entity) => {
        let e: FolderEntity = ent as FolderEntity;
        let vals = applyFolderTransformation(e, e.entities).map((a) => { return a.render(es)(a); }).map((a, ind) => { return {...a, key: ind }; });
        if(SHOW_TRANSFORMATION_POINTS){
          const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
          const at: Transformation = {
            ...tranformation,
            anchor: {
              x: tranformation.anchor.x + (es.config.width / 2),
              y: (es.config.height / 2) + tranformation.anchor.y
            }
          };
          if(RENDERING_ENGINE === 'canvas'){
            const ctx = es.canvas?.getContext('2d');
            if(!ctx) throw new Error('Cannot get canvas context!');
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.translate(at.anchor.x, at.anchor.y);
            // ctx.rotate(at.rotation);
            ctx.fillRect(-10, -10, 20, 20);
            ctx.restore();
            ctx.save();
            ctx.fillStyle = 'blue';
            ctx.translate(at.anchor.x, at.anchor.y);
            ctx.translate(at.translation.x, at.translation.y);
            // ctx.rotate(at.rotation);
            ctx.fillRect(-5, -5, 10, 10);
            ctx.restore(); 
          } else {
            throw new Error('Transformation point rendering not currently supported in React.');
          }
        }
        return <>{vals}</>;
      },
    };
    return ret;
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