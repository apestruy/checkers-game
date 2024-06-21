import React from "react";
import { useGameData } from "../../../contexts/GameDataContext";

const GameInfo = () => {
  const { gameData } = useGameData();

  const capitalizeFirstLetter = (string) => {
    if (!string) return string;
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  return (
    <div className="game-info-container">
      <h2>{capitalizeFirstLetter(gameData.playerName)}, let's play!</h2>

      <div>{gameData.turn === "computer" ? "Computer's" : "Your"} Turn</div>
    </div>
  );
};

export default GameInfo;
