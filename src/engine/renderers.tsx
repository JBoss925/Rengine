import React from 'react';
import { Colors, MathUtil } from "./engine";
import { Entities } from './entity';

export class StyleConversions {

  static CreateRotation = (amt: number) => () => 'rotate(' + amt + 'rad)';
  static CreateScale = (s: Vector2) => () => 'scale(' + s.x + ',' + s.y + ')';

  static CreateTransform = (transformations: (() => string)[]) => {
    return transformations.reduce((prev, curr) => (prev + ' ' + curr()), '');
  }

  static ComputeEntityWorldTransformation = (es: EngineState) => (e: Entity): Transformation => {
    const entityOrigin = Entities.GetEntityOrigin(es)(e);
    const rotatedPoint = MathUtil.RotatePositionAboutPoint(e.properties.rotation)(entityOrigin)(e.properties.position);
    const t: Transformation = {
      translation: rotatedPoint,
      scale: e.properties.scale,
      rotation: e.properties.rotation
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
        (es.config.width / 2) + t.translation.x -
        (t.scale.x * e.properties.size.width) / 2,
      bottom:
      (es.config.height / 2) + t.translation.y -
        (t.scale.y * e.properties.size.height) / 2,
      transform: StyleConversions.CreateTransform([StyleConversions.CreateScale(t.scale), StyleConversions.CreateRotation(t.rotation)]),
    };
  };

}

export class Renderers {
  static BasicTextureRendererReact = (es: EngineState) => (
    t: Texture
  ): Render => {
    const renderFunc: Render = (e: Entity) => {
      const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
      const transformStyle = StyleConversions.TransformationToStyle(es)(tranformation, e);
      return <img src={t.url} alt={t.alt} style={transformStyle} />;
    };
    return renderFunc;
  };
  static BoxRendererReact = (es: EngineState) => (c: Color): Render => {
    const renderFunc: Render = (e: Entity) => {
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
  static BasicTextureRenderer = (es: EngineState) => {
    return ((
    t: Texture
  ): Render => {
    if(es.canvas === null) throw new Error('Cannot render with a canvas renderer without a canvas being linked to the engine state!');
    const renderFunc: Render = (e: Entity) => {
      const transformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
      const transformStyle = StyleConversions.TransformationToStyle(es)(transformation, e);
      return <img src={t.url} alt={t.alt} style={transformStyle} />;
    };
    return renderFunc;
    })
  };
  static BoxRenderer = (es: EngineState) => {
    if(es.canvas === null) throw new Error('Cannot render with a canvas renderer without a canvas being linked to the engine state!');
    return ((c: Color): Render => {
      const renderFunc: Render = (e: Entity) => {
        if(es.canvas === null) throw new Error('Cannot render with a canvas renderer without a canvas being linked to the engine state!');
        const tranformation = StyleConversions.ComputeEntityWorldTransformation(es)(e);
        const at: Transformation = {
          ...tranformation,
          translation: {
            x: tranformation.translation.x - ((e.properties.size.width * tranformation.scale.x) / 2) + (es.config.width / 2),
            y: es.config.height - (tranformation.translation.y - ((e.properties.size.height * tranformation.scale.y) / 2)) - (es.config.height / 2)
          }
        };
        const ctx = es.canvas?.getContext('2d');
        if(!ctx) throw new Error('Cannot get canvas context!');
        ctx.save();
        ctx.fillStyle = "red";
        ctx.translate(at.translation.x, at.translation.y);
        ctx.rotate(at.rotation);
        ctx.rect(-(e.properties.size.width * at.scale.x / 2), -(e.properties.size.height * at.scale.y / 2), (e.properties.size.width * at.scale.x), (e.properties.size.height * at.scale.y));
        ctx.fill();
        ctx.restore();
      };
      return renderFunc;
    });
  };
}