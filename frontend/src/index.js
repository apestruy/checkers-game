import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { GameDataProvider } from "./contexts/GameDataContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <GameDataProvider>
      <App />
    </GameDataProvider>
  </React.StrictMode>
);
