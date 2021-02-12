// Functions for editing the scenes of a gamestate
export class Scenes {

  static CreateScene = (state: EngineState) => (sceneID: string, setActive?: boolean): EngineState => {
    let newScene = {
      uuid: String(sceneID),
      entities: [],
    };
    return {
      ...state,
      scenes: state.scenes.concat(newScene),
      activeScene: setActive === true ? newScene : state.activeScene
    };
  };

  static ActivateScene = (state: EngineState) => (sceneID: string): EngineState => {
    let newScene = state.scenes.find(a => a.uuid === sceneID);
    if(newScene === undefined){
      throw new Error('Couldn\'t find a scene with sceneID: ' + sceneID);
    }
    return {
      ...state,
      activeScene: newScene
    };
  };

  static AddEntityToScene = (state: EngineState) => (sceneID: string) => (
    e: Entity
  ): EngineState => {
    let foundScene = state.scenes.find((a) => a.uuid === sceneID);
    if (foundScene === undefined) throw new Error("No scene could be found with sceneID" + sceneID);
    let newState = state;
    let changedScene: Scene | null = null;
    newState.scenes = newState.scenes.map((a) => {
      if (a.uuid !== foundScene?.uuid) return a;
      changedScene = {
        ...foundScene,
        entities: a.entities.concat(e)
      };
      return changedScene;
    });
    if(changedScene === null) throw new Error("No scene could be found with sceneID" + sceneID);
    return {
      ...newState,
      activeScene: (foundScene.uuid === newState.activeScene?.uuid) ? changedScene : newState.activeScene
    };
  };

  static RemoveEntityFromScene = (state: EngineState) => (sceneID: string) => (
    e: Entity
  ): EngineState => {
    let foundScene = state.scenes.find((a) => a.uuid === sceneID);
    if (foundScene === undefined) throw new Error("No scene could be found with sceneID" + sceneID);
    let newState = state;
    let changedScene: Scene | null = null;
    newState.scenes = newState.scenes.map((a) => {
      if (a.uuid !== foundScene?.uuid) return a;
      changedScene = {
        ...foundScene,
        entities: a.entities.filter(et => et.uuid !== e.uuid)
      };
      return changedScene;
    });
    if(changedScene === null) throw new Error("No scene could be found with sceneID" + sceneID);
    return {
      ...newState,
      activeScene: (foundScene.uuid === newState.activeScene?.uuid) ? changedScene : newState.activeScene
    };
  };
}