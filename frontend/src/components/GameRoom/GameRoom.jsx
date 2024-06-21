import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "../../contexts/GameDataContext";
import GameInfo from "./GameInfo/GameInfo";
import GameBoard from "./GameBoard/GameBoard";
import Dashboard from "./Dashboard/Dashboard";
import "./GameRoom.scss";

const GameRoom = () => {
  const { gameData } = useGameData();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameData.playerId === 0) {
      navigate("/login");
    }
  }, [gameData.playerId, navigate]);

  return (
    <div className="game-room">
      {gameData.playerId > 0 && (
        <>
          <GameInfo />
          <GameBoard />
          <Dashboard />
        </>
      )}
    </div>
  );
};

export default GameRoom;
