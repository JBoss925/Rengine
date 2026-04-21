import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppCanvas from "./engine/app-renderers/App";
import AppReact from "./engine/app-renderers/App-React";
import { RENDERING_ENGINE } from "./Lifecycle";

export const App = (RENDERING_ENGINE === 'canvas') ? AppCanvas : AppReact;

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Failed to find the root element.");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
