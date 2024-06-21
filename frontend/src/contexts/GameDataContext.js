import React, { createContext, useContext, useEffect, useState } from "react";

const GameDataContext = createContext();

export const GameDataProvider = ({ children }) => {
  const [gameData, setGameData] = useState({
    playerName: "",
    playerId: 0,
    turn: "computer",
    playerScore: 0,
    computerScore: 0,
    resetTrigger: false,
    saveGameTrigger: false,
    loadGameTrigger: false,
    board: [],
    message: "",
  });

  useEffect(() => {
    const playerId = localStorage.getItem("playerId");
    const playerName = localStorage.getItem("playerName");
    if (playerId && playerName) {
      setGameData((prevData) => ({
        ...prevData,
        playerId: parseInt(playerId, 10),
        playerName,
      }));
    }
  }, []);

  const saveGame = () => {
    setGameData((prevData) => ({
      ...prevData,
      saveGameTrigger: true,
    }));
  };

  const resetGame = () => {
    setGameData((prevData) => ({
      ...prevData,
      turn: "computer",
      playerScore: 0,
      computerScore: 0,
      resetTrigger: !prevData.resetTrigger,
    }));
  };

  return (
    <GameDataContext.Provider
      value={{ gameData, setGameData, saveGame, resetGame }}
    >
      {children}
    </GameDataContext.Provider>
  );
};

export const useGameData = () => useContext(GameDataContext);
