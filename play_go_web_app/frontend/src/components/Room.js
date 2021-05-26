import React, { useState, useEffect } from "react";
import godash from "godash";
import { Goban } from "react-go-board";

import { makeStyles, responsiveFontSizes } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import Button from "@material-ui/core/Button";
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
} from "@material-ui/core";

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

function leaveButtonPressed(props) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  fetch("/api/leave-room", requestOptions).then((_response) => {
    props.leaveRoomCallback();
    props.history.push("/");
  });
}

export default function Room(props) {
  const classes = useStyles();
  const [board, setBoard] = useState(new godash.Board(19));
  const [player1, setPlayer1] = useState("null");
  const [player2, setPlayer2] = useState("null");
  const [player1Color, setPlayer1Color] = useState("null");
  const [player2Color, setPlayer2Color] = useState("null");
  const [turn, setTurn] = useState(true);
  const [tmpboard, settmpBoard] = useState("[]");

  const ROOM_CODE = window.location.pathname.substring(6);

  const [chatSocket] = useState(
    new WebSocket(
      `ws://` + window.location.host + `/ws/rooms/` + ROOM_CODE + `/`
    )
  );

  useEffect((props) => {
    chatSocket.onmessage = function (e) {
      const data = JSON.parse(e.data);
      console.log(data);
    };

    chatSocket.onclose = function (e) {
      console.error("Chat socket closed unexpectedly");
    };
    console.log("useEffect in use");
    function getRoom() {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/api/get-room" + "?code=" + ROOM_CODE, requestOptions)
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log("fetch method inside useEffect being used");
          // do stuff with responseJSON here...
          setPlayer1(responseJSON.player1);
          setPlayer2(responseJSON.player2);
          setPlayer1Color(responseJSON.player1Color);
          setPlayer2Color(responseJSON.player2Color);
          setTurn(responseJSON.turn);
          // settmpBoard(responseJSON.board);

          console.log(player1);
        });
    }
    getRoom();
    return () => {
      // function leaveRoom() {
      //   const requestOptions = {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //   };
      //   fetch("/api/leave-room", requestOptions).then((_response) => {
      //   });
      // }
      // leaveRoom(props);
    };
  }, []);
  const annotations = [new godash.Coordinate(2, 2)];

  var new_board = 0;

  // const roomName = window.location.pathname;

  function handleCoordinateClick(coordinate) {
    try {
      new_board = godash.addMove(board, coordinate, godash.BLACK);
      setBoard(new_board);

      chatSocket.send(
        JSON.stringify({
          player1: player1,
          player2: player2,
          player1Color: player1Color,
          player2Color: player2Color,
          turn: !turn,
          new_move_x: coordinate.x,
          new_move_y: coordinate.y,
        })
      );

      console.log(new_board.toString());
      console.log(coordinate.toString());
    } catch (error) {
      //error should only occur when clicking on a piece already on the board
      console.log(error);
    }
  }

  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid container xs={12} sm={8}>
          <Grid item xs={12} sm={12}>
            <Paper
              style={{ backgroundColor: "white", color: "black", width: "60%" }}
            >
              <FormControl>
                <InputLabel htmlFor="my-input">{player1}</InputLabel>
                <Input id="my-input" aria-describedby="my-helper-text" />
                <FormHelperText id="my-helper-text">
                  Change your name here.
                </FormHelperText>
              </FormControl>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              <LinearProgress
                variant="determinate"
                value={65}
                color="primary"
              />
              <LinearProgress
                variant="determinate"
                value={65}
                color="primary"
              />
            </Paper>
          </Grid>
          <Grid container justify="center" xs={12} sm={12}>
            <Paper
              style={{
                backgroundColor: "grey",
                color: "black",
                width: "61.5%",
              }}
            >
              <Goban
                board={board}
                boardColor="#f4bc7c"
                annotations={annotations}
                onCoordinateClick={handleCoordinateClick}
              />
            </Paper>
          </Grid>
        </Grid>
        <Grid container xs={12} sm={4}>
          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              xs=12 sm=6
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              xs=12 sm=6
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  leaveButtonPressed(props);
                }}
              >
                Leave Room
              </Button>
            </Paper>
          </Grid>
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
