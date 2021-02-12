import React, { useEffect, useRef } from "react";
import "./App.css";
import { StartGameLoop } from "./Loop";
import { init } from './Lifecycle';

let gameStarted: boolean = true;

const App: React.FunctionComponent = () => {
  if(gameStarted){
    return <GameCanvas />;
  } else {
    return <p>Game not started!</p>;
  }
}

const canvasStyle: React.CSSProperties = {
  height: window.innerHeight,
  width: window.innerWidth,
  position: "absolute",
  top: 0,
  left: 0,
};

const GameCanvas: React.FunctionComponent = () => {
  let canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if(canvasRef.current === null){
      throw new Error('Couldn\'t find canvasRef!');
    } else {
      StartGameLoop([init(canvasRef.current), (es: EngineState) => {
        const ctx = es.canvas?.getContext('2d');
        if(!ctx) throw new Error('Cannot get canvas context!');
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.fillRect(0, 0, es.config.width, es.config.height);
        ctx.stroke();
        es.activeScene?.entities.forEach((e) => {
          e.render(e);
        });
      }]);
    }
  }, [])
  return <canvas ref={canvasRef} style={canvasStyle} width={window.innerWidth} height={window.innerHeight}/>
};

export default App;