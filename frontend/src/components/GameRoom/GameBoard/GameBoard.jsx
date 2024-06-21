import React, { useEffect, useState } from "react";
import { useGameData } from "../../../contexts/GameDataContext";
import {
  initializeBoard,
  moveAndUpdateBoard,
  makeComputerMove,
  isMoveValid,
} from "../../../utils/gameLogic";
import "./GameBoard.scss";

const GameBoard = () => {
  const { gameData, setGameData } = useGameData();
  const [board, setBoard] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useEffect(() => {
    setBoard(initializeBoard());
  }, [gameData.resetTrigger]);

  useEffect(() => {
    if (gameData.saveGameTrigger) {
      setGameData({ ...gameData, board });
    }

    if (gameData.loadGameTrigger) {
      setBoard(gameData.board);
      setGameData({ ...gameData, loadGameTrigger: false });
    }
  }, [gameData.saveGameTrigger, gameData.loadGameTrigger]);

  useEffect(() => {
    if (board.length > 0 && gameData.turn === "computer") {
      const moveDetails = makeComputerMove(board);

      if (moveDetails) {
        setSelectedPiece({ y: moveDetails.from.y, x: moveDetails.from.x });

        setTimeout(() => {
          const updatedBoard = moveAndUpdateBoard(
            board,
            moveDetails.to,
            moveDetails.from,
            "black",
            moveDetails.capturePoint
          );

          setBoard(updatedBoard);
          setSelectedPiece(null);
          setGameData((prev) => {
            const pointsToAdd = moveDetails.capturePoint ? 1 : 0;
            return {
              ...prev,
              turn: "player",
              computerScore: prev.computerScore + pointsToAdd,
            };
          });
        }, 1500);
      } else {
        setGameData({ ...gameData, message: "YOU WON!" });
      }
    }
  }, [gameData.turn, board]);

  const handleCheckerClick = (y, x) => {
    const cell = board[y][x];

    if (!selectedPiece && cell.color === "red") {
      setSelectedPiece({ y, x, color: cell.color });
    } else if (
      selectedPiece &&
      selectedPiece.y === y &&
      selectedPiece.x === x
    ) {
      setSelectedPiece(null);
    }
  };

  const handleMove = (y, x) => {
    const cell = board[y][x];

    if (selectedPiece && cell.isPlayable && !cell.color) {
      const desiredMove = { y, x };
      const moveResult = isMoveValid(board, selectedPiece, desiredMove);

      if (moveResult.isValid) {
        const updatedBoard = moveAndUpdateBoard(
          board,
          desiredMove,
          { y: selectedPiece.y, x: selectedPiece.x },
          selectedPiece.color,
          moveResult.isCapture ? moveResult.capturePoint : null
        );

        setBoard(updatedBoard);
        setSelectedPiece(null);
        setGameData((prev) => {
          const pointsToAdd = moveResult.isCapture ? 1 : 0;
          return {
            ...prev,
            turn: "computer",
            playerScore: prev.playerScore + pointsToAdd,
          };
        });
      }
    }
  };

  return (
    <div className="game-board">
      {board.map((row, y) => (
        <div key={y} className="board-row">
          {row.map((cell, x) => (
            <div
              key={x}
              className={(cell.isPlayable ? "dark" : "light") + " cell"}
              onClick={() => handleMove(y, x)}
            >
              {cell.color && (
                <div
                  className={
                    cell.color +
                    " checker" +
                    (selectedPiece &&
                    selectedPiece.y === y &&
                    selectedPiece.x === x
                      ? " selected"
                      : "")
                  }
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCheckerClick(y, x);
                  }}
                ></div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GameBoard;
