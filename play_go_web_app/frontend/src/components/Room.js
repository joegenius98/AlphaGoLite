import React, { Component, useState } from "react";
import godash from "godash";
import { Goban } from "react-go-board";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "red",

    minHeight: "1000px",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Room() {
  const classes = useStyles();

  // const board = new godash.Board(19);
  const [board, setBoard] = useState(new godash.Board(19));

  const annotations = [new godash.Coordinate(2, 2)];

  function handleCoordinateClick(coordinate) {
    // http://duckpunch.github.io/godash/documentation/#coordinate
    console.log(board.toString());
    setBoard(godash.addMove(board, coordinate, godash.BLACK));
    console.log(board.toString());
    console.log(coordinate);
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid item xs={12} sm={8}>
          <Paper style={{ backgroundColor: "grey", color: "black" }}>tmp</Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper style={{ backgroundColor: "grey", color: "black" }}>
            xs=12 sm=6
          </Paper>
        </Grid>
        <Grid item xs={12} sm={8}>
          <Paper style={{ backgroundColor: "grey", color: "black" }}>
            <LinearProgress />
            <LinearProgress color="primary" />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper style={{ backgroundColor: "grey", color: "black" }}>
            xs=12 sm=6
          </Paper>
        </Grid>
        <Grid container justify="center" xs={12} sm={8}>
          <Paper
            style={{ backgroundColor: "grey", color: "black", width: "60%" }}
          >
            <Goban
              board={board}
              boardColor="#f4bc7c"
              annotations={annotations}
              onCoordinateClick={handleCoordinateClick}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper style={{ backgroundColor: "grey", color: "black" }}>
            xs=12 sm=6
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
}

// <div>
//   <h3>{this.roomCode}</h3>
//   <p>Votes: {this.state.votesToSkip}</p>
/* <p>Guest Can Tilapia: {this.state.guestCanPause.toString()}</p>
        <p>Host: {this.state.isHost.toString()}</p>
        <div style={{width:'300px'}}>
          <Goban
            board={board}
            boardColor="#efefef"
            annotations={annotations}
            onCoordinateClick={this.handleCoordinateClick}
            
          />
        </div> */

// </div>
// AlphaGoLite/play_go_web_app/frontend
