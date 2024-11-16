import React, { useState, useEffect } from 'react';
import './GoBoard.css';

const boardSize = 18; // Adjusted for 18x18 board
const starPoints = [3, 9, 15];

const createBoard = () => {
  let board = [];
  for (let i = 0; i < boardSize; i++) {
    let row = [];
    for (let j = 0; j < boardSize; j++) {
      row.push(null);
    }
    board.push(row);
  }
  return board;
};

const isStarPoint = (row, col) => {
  return starPoints.includes(row) && starPoints.includes(col) &&
         row > 0 && row < boardSize - 1 &&
         col > 0 && col < boardSize - 1;
};

const GoBoard = ({ onGameEnd, setAIIsThinking, updateCapturedStones }) => {
  const [stones, setStones] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('black'); // Explicitly track the current player's turn
  const [isAITurn, setIsAITurn] = useState(false);

  const board = createBoard();

  const isCaptured = (row, col, color, visited = new Set()) => {
    if (row < 0 || col < 0 || row >= boardSize || col >= boardSize) return false;
    if (visited.has(`${row}-${col}`)) return true;

    visited.add(`${row}-${col}`);

    const stone = stones.find(s => s.row === row && s.col === col);
    if (!stone) return false; // Empty space means not surrounded
    if (stone.color !== color) return true; // Stone is opposing color

    // Check all adjacent cells
    return (
      isCaptured(row - 1, col, color, visited) &&
      isCaptured(row + 1, col, color, visited) &&
      isCaptured(row, col - 1, color, visited) &&
      isCaptured(row, col + 1, color, visited)
    );
  };

  const handleCellClick = (rowIndex, cellIndex) => {
    if (isAITurn || stones.some(stone => stone.row === rowIndex && stone.col === cellIndex)) {
      return; // Ignore clicks during AI's turn or if the cell is occupied
    }

    const newStone = {
      row: rowIndex,
      col: cellIndex,
      color: currentTurn,
    };
    setStones([...stones, newStone]);

    // Check for captured stones
    const opponentColor = currentTurn === 'black' ? 'white' : 'black';
    let capturedCount = 0;

    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (stones.some(s => s.row === i && s.col === j && s.color === opponentColor)) {
          const visited = new Set();
          if (isCaptured(i, j, opponentColor, visited)) {
            capturedCount += 1;
            setStones(prevStones => prevStones.filter(stone => !(stone.row === i && stone.col === j)));
          }
        }
      }
    }

    if (capturedCount > 0) {
      updateCapturedStones(opponentColor, capturedCount);
    }

    // Switch turn after a valid move
    setCurrentTurn(currentTurn === 'black' ? 'white' : 'black');
    setIsAITurn(true);
    setAIIsThinking(true); // Notify parent that AI has started thinking
  };

  useEffect(() => {
    if (isAITurn) {
      const makeAITurn = () => {
        for (let i = 0; i < boardSize; i++) {
          for (let j = 0; j < boardSize; j++) {
            if (!stones.some(stone => stone.row === i && stone.col === j)) {
              setTimeout(() => {
                setStones(prevStones => [
                  ...prevStones,
                  { row: i, col: j, color: currentTurn },
                ]);
                setCurrentTurn(currentTurn === 'black' ? 'white' : 'black'); // AI finishes its turn
                setIsAITurn(false);
                setAIIsThinking(false); // Notify parent that AI has finished thinking
              }, 5); // Simulate "thinking" time
              return;
            }
          }
        }
        setAIIsThinking(false); // In case no valid moves are available
      };

      makeAITurn();
    }
  }, [isAITurn, stones, setAIIsThinking, currentTurn]);

  useEffect(() => {
    if (stones.length >= boardSize * boardSize) {
      onGameEnd(); // Trigger game end when all cells are filled
    }
  }, [stones, onGameEnd]);

  return (
    <div className="board-container">
      <div
        className="board-grid"
        style={{
          gridTemplateColumns: `repeat(${boardSize}, 20px)`,
          gridTemplateRows: `repeat(${boardSize}, 20px)`,
        }}
      >
        {board.map((row, rowIndex) => (
          row.map((cell, cellIndex) => (
            <div
              key={`${rowIndex}-${cellIndex}`}
              className="grid-cell"
              onClick={() => handleCellClick(rowIndex, cellIndex)}
            >
              {rowIndex < boardSize - 1 && <div className="grid-line-vertical"></div>}
              {cellIndex < boardSize - 1 && <div className="grid-line-horizontal"></div>}
              {isStarPoint(rowIndex, cellIndex) && <div className="star-point"></div>}
              {stones.map((stone, index) => (
                stone.row === rowIndex && stone.col === cellIndex && (
                  <img
                    key={index}
                    src={stone.color === 'black' ? '/Stone-1.svg' : '/Stone-2.svg'}
                    className="stone"
                    alt={`${stone.color} stone`}
                  />
                )
              ))}
            </div>
          ))
        ))}
      </div>
    </div>
  );
};

export default GoBoard;
