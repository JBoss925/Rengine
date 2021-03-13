import React from 'react';
import { RENDERING_ENGINE, SHOW_TRANSFORMATION_POINTS } from '../Lifecycle';
import { Colors, MathUtil } from "./engine";

export class StyleConversions {

  static CreateRotation = (amt: number) => () => 'rotate(' + amt + 'rad)';
  static CreateScale = (s: Vector2) => () => 'scale(' + s.x + ',' + s.y + ')';

  static CreateTransform = (transformations: (() => string)[]) => {
    return transformations.reduce((prev, curr) => (prev + ' ' + curr()), '');
  }

  static ComputeEntityWorldTransformation = (es: EngineState) => (e: Entity): Transformation => {
    const rotatedPoint = MathUtil.RotatePositionAboutPoint(-e.properties.rotation)(e.properties.anchor)(e.properties.position);
    let difX = rotatedPoint.x - e.properties.anchor.x, difY = rotatedPoint.y - e.properties.anchor.y;
    const t: Transformation = {
      translation: { x: difX, y: difY },
      finalPosition: rotatedPoint,
      scale: e.properties.scale,
      rotation: e.properties.rotation,
      anchor: e.properties.anchor
    };
    return t;
  };

  static TransformationToStyle = (es: EngineState) => (t: Transformation,
    e: Entity
  ): React.CSSProperties => {
    return {
      position: "absolute",
      width: e.properties.size.width,
      height: e.properties.size.height,
      left:
        (es.config.width / 2) + t.finalPosition.x -
        (t.scale.x * e.properties.size.width) / 2,
      top:
      (es.config.height / 2) + t.finalPosition.y -
        (t.scale.y * e.properties.size.height) / 2,
      transform: StyleConversions.CreateTransform([StyleConversions.CreateScale(t.scale), StyleConversions.CreateRotation(t.rotation)]),
    };
  };

}

export class Renderers {
  static BasicTextureRenderer = (esInit: EngineState) => (
    t: Texture
  ): Render => {
    if(RENDERING_ENGINE === "react"){
      const renderFunc: Render = (es: EngineState) => (e: Entity) => {
        const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
        const transformStyle = StyleConversions.TransformationToStyle(es)(tranformation, e);
        return <img src={t.url} alt={t.alt} style={transformStyle} />;
      };
      return renderFunc;
    } else {
      throw new Error("unimplemented!");
    }
  };
  static BoxRendererReact = (esInit: EngineState) => (c: Color): Render => {
    const renderFunc: Render = (es: EngineState) => (e: Entity) => {
      const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
      const transformStyle = StyleConversions.TransformationToStyle(es)(tranformation, e);
      return (
        <div
          style={{ ...transformStyle, background: Colors.ColorToString(c) }}
        />
      );
    };
    return renderFunc;
  };
  static BoxRenderer = (esInit: EngineState) => {
    if(RENDERING_ENGINE === "canvas"){
      if(esInit.canvas === null) throw new Error('Cannot render with a canvas renderer without a canvas being linked to the engine state!');
      return ((c: Color): Render => {
        const renderFunc: Render = (es: EngineState) => (e: Entity) => {
          if(es.canvas === null) throw new Error('Cannot render with a canvas renderer without a canvas being linked to the engine state!');
          const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
          const at: Transformation = {
            ...tranformation,
            anchor: {
              x: tranformation.anchor.x + (es.config.width / 2),
              y: (es.config.height / 2) + tranformation.anchor.y
            }
          };
          const ctx = es.canvas?.getContext('2d');
          if(!ctx) throw new Error('Cannot get canvas context!');
          ctx.save();
          ctx.fillStyle = Colors.ColorToString(c);
          ctx.translate(at.anchor.x, at.anchor.y);
          ctx.translate(at.translation.x, at.translation.y);
          ctx.rotate(at.rotation);
          const boxWidth = (e.properties.size.width * at.scale.x);
          const boxHeight = (e.properties.size.height * at.scale.y);
          ctx.fillRect(-(boxWidth / 2), 
          -(boxHeight / 2),
          boxWidth, boxHeight);
          ctx.restore();
          if(SHOW_TRANSFORMATION_POINTS){
            ctx.save();
            ctx.fillStyle = 'red';
            ctx.translate(at.anchor.x, at.anchor.y);
            ctx.fillRect(-10, -10, 20, 20);
            ctx.restore();
            ctx.save();
            ctx.fillStyle = 'blue';
            ctx.translate(at.anchor.x, at.anchor.y);
            ctx.translate(at.translation.x, at.translation.y);
            ctx.fillRect(-5, -5, 10, 10);
            ctx.restore();
            ctx.save();
            ctx.strokeStyle = 'black';
            ctx.translate(at.anchor.x, at.anchor.y);
            ctx.translate(at.translation.x, at.translation.y);
            ctx.moveTo(0,0);
            ctx.lineTo(-at.translation.x, -at.translation.y);
            ctx.stroke();
            ctx.restore();
          }
        };
        return renderFunc;
      });
    } else if (RENDERING_ENGINE === "react"){
      return (c: Color): Render => {
        const renderFunc: Render = (es: EngineState) => (e: Entity) => {
          if(SHOW_TRANSFORMATION_POINTS){
            throw new Error('Transformation point rendering not currently supported in React.');
          }
          const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
          const transformStyle = StyleConversions.TransformationToStyle(es)(tranformation, e);
          return (
            <div
              style={{ ...transformStyle, background: Colors.ColorToString(c) }}
            />
          );
        };
        return renderFunc;
      }
    } else {
      throw new Error('unimplemented!');
    }
  };
}