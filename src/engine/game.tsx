// Overall engine-wide state transformations
export class Games {

  static TickActiveScene = (state: EngineState) => (delta: number): EngineState => {
    let newState = state;
    if(newState.activeScene === null){
      throw new Error('Cannot tick a null active scene!');
    }
    let newActiveScene = newState.activeScene;
    newActiveScene.entities = newActiveScene.entities.map((e) => {
      const finComp = e.components.reduce(([pe, pns], c) => {
        return c.update(delta, pe, newActiveScene, pns);
      }, [e, newState] as [Entity, EngineState]);
      newState = finComp[1];
      return finComp[0];
    });
    newState.activeScene = newActiveScene;
    newState.scenes = newState.scenes.map((s) => {
      if(s.uuid === newActiveScene.uuid){
        return newActiveScene;
      } else {
        return s;
      }
    });
    return newState;
  };

  static InitEngine = (config?: GlobalConfig, canvas?: HTMLCanvasElement): EngineState => {
    return {
      scenes: [],
      activeScene: null,
      config: config ?? { origin: 'center', width: window.innerWidth, height: window.innerHeight },
      canvas: canvas ?? null
    };
  };
}