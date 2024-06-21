export const initializeBoard = () => {
  const initialBoard = [];
  // it will look like this:
  // array[row][column]
  // array[y][x]

  // create an 8x8 board from top to bottom
  for (let y = 0; y < 8; y++) {
    // initialize each row as an empty array
    initialBoard[y] = [];

    for (let x = 0; x < 8; x++) {
      // place pieces only on dark cells on all rows except middle 2
      if ((x + y) % 2 === 0) {
        initialBoard[y][x] = { color: null, isPlayable: true };
        if (y < 3) initialBoard[y][x].color = "black"; // Computer's pieces
        if (y > 4) initialBoard[y][x].color = "red"; // Player's pieces
      } else {
        initialBoard[y][x] = { isPlayable: false };
      }
    }
  }

  return initialBoard;
};

export const moveAndUpdateBoard = (
  board,
  newPosition,
  oldPosition,
  color,
  capture = null
) => {
  const updatedBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  updatedBoard[newPosition.y][newPosition.x].color = color;
  updatedBoard[oldPosition.y][oldPosition.x].color = null;

  if (capture) {
    updatedBoard[capture.y][capture.x].color = null;
  }

  return updatedBoard;
};

export const makeComputerMove = (board) => {
  const moves = findAllMoves(board, "black");

  let selectedMove = null;

  if (moves.captureMoves.length > 0) {
    selectedMove = moves.captureMoves[0];
  } else if (moves.forwardMoves.length > 0) {
    const randomMove = Math.floor(Math.random() * moves.forwardMoves.length);
    selectedMove = moves.forwardMoves[randomMove];
  }

  if (!selectedMove) {
    // computer lost, has no more moves
    return null;
  }

  return {
    from: selectedMove.from,
    to: selectedMove.to,
    capturePoint: selectedMove.isCapture ? selectedMove.capturePoint : null,
  };
};

const isWithinBoardLimits = (y, x, board) =>
  y >= 0 && y < board.length && x >= 0 && x < board[y].length;

const findAllMoves = (board, color) => {
  let captureMoves = [];
  let forwardMoves = [];

  board.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell.color === color) {
        const position = { y, x };
        const isKing = board[y][x].isKing;
        const potentialMoves = getPotentialMoves(position, color, isKing);

        potentialMoves.forEach((move) => {
          if (isWithinBoardLimits(move.y, move.x, board)) {
            const moveResult = isMoveValid(board, { y, x, color }, move);

            if (moveResult.isValid) {
              const moveDetails = { from: { y, x }, to: move, ...moveResult };

              if (moveResult.isCapture) {
                captureMoves.push(moveDetails);
              } else {
                forwardMoves.push(moveDetails);
              }
            }
          }
        });
      }
    });
  });

  return { captureMoves, forwardMoves };
};

const getPotentialMoves = (position, color, isKing = false) => {
  const { y, x } = position;
  const forward = color === "red" ? -1 : 1;
  const backward = -forward;

  let potentialMoves = [
    // Forward Moves:
    { y: y + forward, x: x - 1 },
    { y: y + forward, x: x + 1 },
    // Capture Moves:
    { y: y + 2 * forward, x: x - 2 },
    { y: y + 2 * forward, x: x + 2 },
  ];

  return potentialMoves;
};

export const isMoveValid = (board, selectedPiece, desiredMove) => {
  const direction = selectedPiece.color === "red" ? -1 : 1;
  const opponentColor = selectedPiece.color === "red" ? "black" : "red";

  const moveResult = checkMove(
    board,
    selectedPiece,
    desiredMove,
    direction,
    opponentColor
  );

  return moveResult;
};

const checkMove = (
  board,
  selectedPiece,
  desiredMove,
  direction,
  opponentColor
) => {
  const verticalMove = desiredMove.y - selectedPiece.y;
  const horizontalMove = desiredMove.x - selectedPiece.x;

  const capturePointY = (selectedPiece.y + desiredMove.y) / 2;
  const capturePointX = (selectedPiece.x + desiredMove.x) / 2;

  // Forward Move Check
  if (
    verticalMove === direction &&
    Math.abs(horizontalMove) === 1 &&
    board[desiredMove.y][desiredMove.x].color === null
  ) {
    return { isValid: true, isCapture: false };
  }

  // Capture Move Check
  if (
    verticalMove === 2 * direction &&
    Math.abs(horizontalMove) === 2 &&
    board[capturePointY][capturePointX].color === opponentColor &&
    board[desiredMove.y][desiredMove.x].color === null
  ) {
    return {
      isValid: true,
      isCapture: true,
      capturePoint: { y: capturePointY, x: capturePointX },
    };
  }

  return { isValid: false, isCapture: false };
};
