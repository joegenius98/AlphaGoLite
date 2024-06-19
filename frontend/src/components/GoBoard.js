import React from 'react';

const boardSize = 18;
const starPoints = [3, 9, 15]; // Positions for the 9 dots on a 19x19 board

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
  return starPoints.includes(row) && starPoints.includes(col);
};
        


const GoBoard = () => {
  const board = createBoard();

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${boardSize}, 20px)`,
      gridTemplateRows: `repeat(${boardSize}, 20px)`,
      gap: "1px",
      backgroundColor: "#000",
    }}>
      {board.map((row, rowIndex) => (
        row.map((cell, cellIndex) => (
          <div key={`${rowIndex}-${cellIndex}`} style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#F3C469",
            border: "1px solid #848484",
            position: "relative",
          }}>
            {isStarPoint(rowIndex, cellIndex)  && 
              <div style={{
                width: "5px",
                height: "5px",
                backgroundColor: "#000",
                borderRadius: "50%",
                position: "absolute",
                top: "-3px",
                left: "-3px",
              }}></div>
            }
          </div>
        ))
      ))}
    </div>
  );
};

export default GoBoard;
