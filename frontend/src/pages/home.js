import React from 'react';
import GoBoard from '../components/GoBoard';

const Home = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#FFFBF3",
      padding: "20px"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        marginRight: "20px"
      }}>
        <h1 style={{
          color: "black",
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px"
        }}>
          🚀 Alpha Go Lite V0.0.1
        </h1>
        <div style={{
          fontSize: "14px",
          color: "black"
        }}>
          <p><strong>How to play</strong></p>
          <p>Place black or white stones on the board's grid intersections to surround more territory than your opponent.</p>
          <p>Capture enemy stones by completely surrounding them.</p>
          <p>The game ends when both players pass consecutively, signaling no further moves can increase territory.</p>
          <p>The player with the most territory wins.</p>
        </div>
      </div>
      <GoBoard />
    </div>
  );
};

export default Home;
