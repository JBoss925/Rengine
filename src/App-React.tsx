import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { StartGameLoop } from "./Loop";
import { init } from './Lifecycle';

const rootStyle: React.CSSProperties = {
  width: "100vw",
  height: "100vh",
  position: "absolute",
  top: 0,
  left: 0,
};

export const DrawGame: React.FunctionComponent<{ state: EngineState }> = ({ state }) => {
  if(state.activeScene === null){
    return <></>;
  } else {
    const scene = state.activeScene;
    const entitiesRendered = scene.entities.map((e, ind) => { return { ...e.render(e), key: ind } });
    return <>{entitiesRendered}</>;
  }
};

let gameStarted: boolean = false;

const App: React.FunctionComponent = () => {
  const [state, setState] = useState<EngineState>(init());
  let drawnGameRef = useRef(<DrawGame state={state}/>);
  const [, updateState] = React.useState<{}>();
  const forceUpdate = React.useCallback(() => updateState({}), []);
  const renderCB = (es: EngineState) => { drawnGameRef.current = <DrawGame state={es}/>; setState(es); forceUpdate(); }
  useEffect(() => {
    if(!gameStarted){
      StartGameLoop([state, renderCB]);
      gameStarted = true;
    }
    return () => {};
  });
  return <div style={rootStyle} id="rhythm-root">
    {drawnGameRef.current}
  </div>;
}

export default App;