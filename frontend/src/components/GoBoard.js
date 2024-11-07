import React from 'react';

const boardSize = 18; // Adjusted for 18x18 board
const starPoints = [3, 9, 15]; // Positions for star points

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

const GoBoard = () => {
  const board = createBoard();
  const [stones, setStones] = React.useState([]);

  const handleCellClick = (rowIndex, cellIndex) => {
    if (!stones.some(stone => stone.row === rowIndex && stone.col === cellIndex)) {
      setStones([...stones, {
        row: rowIndex,
        col: cellIndex,
        color: stones.length % 2 === 0 ? "black" : "white",
      }]);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F3C469",
      padding: "20px",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${boardSize}, 20px)`,
        gridTemplateRows: `repeat(${boardSize}, 20px)`,
        gap: "0",
        position: "relative",
      }}>
        {board.map((row, rowIndex) => (
          row.map((cell, cellIndex) => (
            <div key={`${rowIndex}-${cellIndex}`} style={{
              width: "20px",
              height: "20px",
              position: "relative",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }} onClick={() => handleCellClick(rowIndex, cellIndex)}>
              {/* Grid Lines */}
              {rowIndex < boardSize - 1 && (
                <div style={{
                  position: "absolute",
                  top: "0",
                  left: "50%",
                  width: "1px",
                  height: "100%",
                  backgroundColor: "#000",
                  transform: "translateX(-50%)",
                }}></div>
              )}
              {cellIndex < boardSize - 1 && (
                <div style={{
                  position: "absolute",
                  left: "0",
                  top: "50%",
                  width: "100%",
                  height: "1px",
                  backgroundColor: "#000",
                  transform: "translateY(-50%)",
                }}></div>
              )}

              {/* Star Points */}
              {isStarPoint(rowIndex, cellIndex) && (
                <div style={{
                  width: "5px",
                  height: "5px",
                  backgroundColor: "#000",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                }}></div>
              )}

              {/* Stones */}
              {stones.map((stone, index) => (
                stone.row === rowIndex && stone.col === cellIndex && (
                  <img key={index} src={stone.color === "black" ? "/Stone-1.svg" : "/Stone-2.svg"} style={{
                    width: "15px",
                    height: "15px",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }} alt={`${stone.color} stone`} />
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
