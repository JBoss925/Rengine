export class AnimationEngine {

  static OffsetAnimationComponent = (xFunc: (x: number, y: number) => number) => (yFunc: (x: number, y: number) => number) => 
  (beforeUpdate?: UpdateFunction) => (afterUpdate?: UpdateFunction): Component => {
    return {
      update: (d, e, s, ps) => {
        if(beforeUpdate){ 
          let [eR, esR] = beforeUpdate(d, e, s, ps);
          e = eR;
          ps = esR;
        }
        e.properties.position = {
          x: e.properties.position.x + xFunc(e.properties.position.x, e.properties.position.y),
          y: e.properties.position.y + yFunc(e.properties.position.x, e.properties.position.y),
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
  
  static PositionAnimationComponent = (xFunc: (x: number, y: number) => number) => (yFunc: (x: number, y: number) => number) =>
  (beforeUpdate?: UpdateFunction) => (afterUpdate?: UpdateFunction): Component => {
    return {
      update: (d, e, s, ps) => {
        if(beforeUpdate){ 
          let [eR, esR] = beforeUpdate(d, e, s, ps);
          e = eR;
          ps = esR;
        }
        e.properties.position = {
          x: xFunc(e.properties.position.x, e.properties.position.y),
          y: yFunc(e.properties.position.x, e.properties.position.y),
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