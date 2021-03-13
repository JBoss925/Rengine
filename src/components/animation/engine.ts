export class AnimationFactory {

  static OffsetAnimationComponent = (xFunc: (delta: number, x: number, y: number) => number) => (yFunc: (delta: number, x: number, y: number) => number) => 
  (beforeUpdate?: UpdateFunction) => (afterUpdate?: UpdateFunction): Component => {
    return {
      update: (d, e, s, ps) => {
        if(beforeUpdate){ 
          let [eR, esR] = beforeUpdate(d, e, s, ps);
          e = eR;
          ps = esR;
        }
        e.properties.position = {
          x: e.properties.position.x + xFunc(d, e.properties.position.x, e.properties.position.y),
          y: e.properties.position.y + yFunc(d, e.properties.position.x, e.properties.position.y),
        };
        if(afterUpdate){ 
          let [eAR, eAsR] = afterUpdate(d, e, s, ps);
          e = eAR;
          ps = eAsR;
        }
        return [e, ps];
      }
    };
  };
  
  static PositionAnimationComponent = (xFunc: (delta: number, x: number, y: number) => number) => (yFunc: (delta: number, x: number, y: number) => number) =>
  (beforeUpdate?: UpdateFunction) => (afterUpdate?: UpdateFunction): Component => {
    return {
      update: (d, e, s, ps) => {
        if(beforeUpdate){ 
          let [eR, esR] = beforeUpdate(d, e, s, ps);
          e = eR;
          ps = esR;
        }
        e.properties.position = {
          x: xFunc(d, e.properties.position.x, e.properties.position.y),
          y: yFunc(d, e.properties.position.x, e.properties.position.y),
        };
        if(afterUpdate){ 
          let [eAR, eAsR] = afterUpdate(d, e, s, ps);
          e = eAR;
          ps = eAsR;
        }
        return [e, ps];
      }
    };
  };

}