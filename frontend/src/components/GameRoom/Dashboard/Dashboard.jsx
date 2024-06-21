import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGameData } from "../../../contexts/GameDataContext";

const Dashboard = () => {
  const { gameData, setGameData, saveGame, resetGame } = useGameData();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      gameData.saveGameTrigger &&
      gameData.board &&
      gameData.board.length > 0
    ) {
      const gameState = {
        state: gameData.board,
        player_turn: gameData.turn,
        player_id: gameData.playerId,
        player_score: gameData.playerScore,
        computer_score: gameData.computerScore,
      };

      fetch(`${process.env.REACT_APP_API_URL}/games`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gameState),
      })
        .then((response) => response.json())
        .then(() => {
          setGameData((prevData) => ({
            ...prevData,
            saveGameTrigger: false,
            message: "Game saved successfully",
          }));
        })
        .catch(() => {
          setGameData((prevData) => ({
            ...prevData,
            message: "Network error. Please try again later.",
          }));
        });
    }
  }, [gameData.saveGameTrigger, gameData.board, gameData]);

  const handleLoadGame = () => {
    fetch(`${process.env.REACT_APP_API_URL}/game/${gameData.playerId}/last`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          setGameData((prevData) => ({
            ...prevData,
            message: "No games saved yet",
          }));
          return Promise.reject("Failed to load game");
        }
      })
      .then((data) => {
        setGameData((prevData) => ({
          ...prevData,
          saveGameTrigger: false,
          turn: data.player_turn,
          playerScore: data.player_score,
          computerScore: data.computer_score,
          board: data.state,
          loadGameTrigger: true,
        }));
      })
      .catch(() => {
        setGameData((prevData) => ({
          ...prevData,
          errorMessage: "Network error. Please try again later.",
        }));
      });
  };

  const handleLogout = () => {
    fetch(`${process.env.REACT_APP_API_URL}/logout`)
      .then((response) => response.text())
      .then((data) => {
        localStorage.removeItem("playerId");
        localStorage.removeItem("playerName");

        setGameData({
          playerName: "",
          playerId: 0,
          turn: "computer",
          playerScore: 0,
          computerScore: 0,
          resetTrigger: false,
        });

        navigate("/login", { replace: true });
      });
  };

  return (
    <div className="dashboard">
      <div className="score-tracker-container">
        <h2>Scores</h2>
        <div className="score-item">
          <span>Player:</span>
          <span>{gameData.playerScore}</span>
        </div>

        <div className="score-item">
          <span>Computer:</span>
          <span>{gameData.computerScore}</span>
        </div>
      </div>

      <div className="game-controls">
        <div className="button-container">
          <button className="control-button" onClick={saveGame}>
            Save Game
          </button>
          <button className="control-button" onClick={handleLoadGame}>
            Load Previous Game
          </button>
          <button className="control-button" onClick={resetGame}>
            Reset Game
          </button>
          <button className="control-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
