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
  const [stones, setStones] = React.useState([]);
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: `repeat(${boardSize}, 20px)`,
      gridTemplateRows: `repeat(${boardSize}, 20px)`,
      gap: "1px",
      backgroundColor: "#000",
    }} 
    >
      {board.map((row, rowIndex) => (
        row.map((cell, cellIndex) => (
          <div key={`${rowIndex}-${cellIndex}`} style={{
            width: "20px",
            height: "20px",
            backgroundColor: "#F3C469",
            border: "1px solid #848484",
            position: "relative",
          }} onClick={
            () => {
              if (stones.length % 2 === 0) {
                setStones([...stones, {row: rowIndex, col: cellIndex, color: "black"}]);
              } else {
                setStones([...stones, {row: rowIndex, col: cellIndex, color: "white"}]);
              }
            }
          }>
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
            {
              stones.map((stone, index) => (
                stone.row === rowIndex && stone.col === cellIndex && 
                // <div key={index} style={{
                //   width: "15px",
                //   height: "15px",
                //   backgroundColor: stone.color,
                //   borderRadius: "50%",
                //   position: "absolute",
                //   top: "2px",
                //   left: "2px",
                // }}></div>
                // instead use the svg element from /public/Stone-1.svg for black stones and /public/Stone-2.svg for white stones
               <svg key={index} style={{
                width: "15px",
                height: "15px",
                position: "absolute",
                top: "2px",
                left: "2px",
              }}>
                <use href={stone.color === "black" ? "/Stone-1.svg" : "/Stone-2.svg"} />
              </svg>

              ))
            }
          </div>
        ))
      ))}
    </div>
  );
};

export default GoBoard;
