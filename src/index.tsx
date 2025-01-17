import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import AppCanvas from './engine/app-renderers/App';
import AppReact from './engine/app-renderers/App-React';
import reportWebVitals from './reportWebVitals';
import { RENDERING_ENGINE } from './Lifecycle';

export const App = (RENDERING_ENGINE === 'canvas') ? AppCanvas : AppReact;

ReactDOM.render(
  <React.StrictMode>
    <App/>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
