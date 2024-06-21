import React, { useEffect } from "react";
import PageContainer from "./PageContainer";
import "./App.scss";
import { useGameData } from "./contexts/GameDataContext";

function App() {
  const { gameData, setGameData } = useGameData();

  useEffect(() => {
    if (gameData.message) {
      const timer = setTimeout(() => {
        setGameData((prevData) => ({ ...prevData, message: "" }));
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [gameData.message]);

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Checkers</h1>
      </header>

      {gameData.message && (
        <div className="message-container">
          <div className="message">{gameData.message}</div>
        </div>
      )}

      <main className="app-body">
        <PageContainer />
      </main>
    </div>
  );
}

export default App;
