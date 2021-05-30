import React, { useState, useEffect, useRef } from "react";
import godash from "godash";
import { Goban } from "react-go-board";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  LinearProgress,
  Paper,
  Grid,
  Select,
  FormControl,
  MenuItem,
  InputLabel,
  DialogTitle,
  DialogContent,
  Dialog,
  DialogActions,
  Input,
  FormHelperText,
  InputBase,
  Typography,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "white",

    minHeight: "1000px",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  container: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

function leaveButtonPressed(props) {
  console.log("Here are the props for leaveButtonPressed:");
  console.log(props);
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
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Color, setPlayer1Color] = useState("null");
  const [player2Color, setPlayer2Color] = useState("null");
  const [turn,setTurn] = useState(true);
  // const [tmpboard, settmpBoard] = useState("[]");
  const [curPlayer, setCurPlayer] = useState("null");
  const [nameForm, setNameForm] = useState(true);
  const ROOM_CODE = window.location.pathname.substring(6);
  const [open, setOpen] = React.useState(false);
  const [AI, setAI] = useState(false);
  const [firstMove,setFirstMove]=useState(false);
  const [age, setAge] = React.useState("");

  const handleChange = (event) => {
    setAge(Number(event.target.value) || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // roomSocket instantiated with useState because otherwise,
  // the same room would possess six sockets instead of one. (seen by console logging)
  // We assume this is because this React component gets re-rendered multiple times (6 times, probably)
  // when a user enter this room.
  const [roomSocket] = useState(
    new WebSocket(`ws://${window.location.host}/ws/rooms/${ROOM_CODE}/`)
  );

  // const roomSocket = new WebSocket(
  //   "ws://" + window.location.host + "/ws/rooms/" + ROOM_CODE + "/"
  // );

  roomSocket.onmessage = function (e) {
    console.log("RoomSocket onmessage running");
    const data = JSON.parse(e.data);
    console.log(data);
    setPlayer1(data.player1);
    setPlayer2(data.player2);
    setPlayer1Color(data.player1Color);
    setPlayer2Color(data.player2Color);
    
    
    if (data.new_move_x != -1) {
      setBoard(
        godash.addMove(
          board,
          new godash.Coordinate(data.new_move_x, data.new_move_y),
          // if black just made a move, it is white's turn (turn == false)
          turn==firstMove ? godash.WHITE : godash.BLACK
        )
      );
    }
    setTurn(data.turn);
  };

  roomSocket.onclose = function (e) {
    console.error("Chat socket closed unexpectedly");
  };

  function getBoard(boardStr) {
    let toRet = new godash.Board(19);
    for (let i in boardStr) {
      if (boardStr[i] !== "0")
        toRet = godash.addMove(
          toRet,
          new godash.Coordinate(i % 19, Math.floor(i / 19)),
          boardStr[i] == "1" ? godash.BLACK : godash.WHITE
        );
    }

    return toRet;
  }

  // function getBoardStr() {
  //   board.m
  // }

  //called every time a user joins the room
  useEffect((props) => {
    console.log("useEffect in use");
    function getRoom() {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/api/get-room" + "?code=" + ROOM_CODE, requestOptions)
        .then((response) => response.json())
        .then((responseJSON) => {
          // console.log("fetch method inside useEffect being used");
          // do stuff with responseJSON here...
          //use let keyword inside of this function scope
          let p1;
          let p2;
          //if player 1 joins first (both players have "TMP" in front)
          if (responseJSON.player1.substring(0, 3) == "TMP") {
            //strip off "TMP" from player 1 and set it as player
            p1 = responseJSON.player1.substring(3);
            p2 = responseJSON.player2;
            setCurPlayer("p1");
            setPlayer1(p1);
            setPlayer2(p2);
          }

          //if player 2 joins next
          else if (responseJSON.player2.substring(0, 3) == "TMP" && !AI) {
            //strip off "TMP" from player 2 and set it as player
            p1 = responseJSON.player1;
            p2 = responseJSON.player2.substring(3);
            setCurPlayer("p2");
            setPlayer1(p1);
            setPlayer2(p2);
          }

          //Spectator Case (first two people/players have joined already -- so now anyone who joins is a spectator)
          else {
            p1 = responseJSON.player1;
            p2 = responseJSON.player2;

            setCurPlayer("spectator");
            setPlayer1(responseJSON.player1);
            setPlayer2(responseJSON.player2);
          }

          //render the player colors onto screen
          setPlayer1Color(responseJSON.player1Color);
          setPlayer2Color(responseJSON.player2Color);

          //render the board
          setBoard(getBoard(responseJSON.board));

          // set to whoever's turn it is at the moment
          setTurn(responseJSON.turn);
          setFirstMove(responseJSON.turn);
          setAI(responseJSON.AI);

          //for updating backend with new player names (from stripping off "TMP"s)
          roomSocket.send(
            JSON.stringify({
              player1: p1,
              player2: p2,
              player1Color: responseJSON.player1Color,
              player2Color: responseJSON.player2Color,
              turn: responseJSON.turn.toString(),
              new_move_x: -1,
              new_move_y: -1,
            })
          );
        });
    }
    getRoom();
    return () => {
      function leaveRoom() {
        const requestOptions = {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {
        });
      }
      leaveRoom(props);
    };
  }, []);
  // const annotations = [new godash.Coordinate(2, 2)];

  var new_board = null;
  var colorPiece = null;

  // const roomName = window.location.pathname;

  function handleCoordinateClick(coordinate) {
    //was here for debugging purposes
    // console.log(coordinate);
    if (!((turn && (curPlayer=="p1"))||(!turn && (curPlayer=="p2")))){
      console.log(firstMove,turn,curPlayer);
      return;
    }
    try {
     
      colorPiece = turn==firstMove ? godash.WHITE : godash.BLACK;
      new_board = godash.addMove(board, coordinate, colorPiece);
      // this setBoard was here to trigger a re-render so that all clients (people who view the room) can have the board updated.
      setBoard(new_board);

      console.log(
        new_board.moves
          .entrySeq()
          .forEach((e) =>
            console.log(
              `coordinate: (${e[0].x}, ${
                e[0].y
              }), value type: ${typeof e[1]}, value: ${e[1]}`
            )
          )
      );

      //for updating backend with new board and to send to other clients too
      roomSocket.send(
        JSON.stringify({
          player1: player1,
          player2: player2,
          player1Color: player1Color,
          player2Color: player2Color,
          turn: AI? 
            firstMove? (!turn).toString()+"B": (!turn).toString()+"W" : (!turn).toString(),
          new_move_x: coordinate.x,
          new_move_y: coordinate.y,
        })
      );
      setTurn(!turn);

      console.log("Board stats under handleCoordinateClick");
      console.log(new_board.toString());
      console.log(coordinate.toString());
    } catch (error) {
      //error should only occur when clicking on a piece already on the board
      // later on: display error as a React component, maybe.
      //but we don't want to break the flow for those who are more experienced.
      console.log(error);
    }
  }

  function changeName(e) {
    e.stopPropagation();
    if (e.key === "Enter") {
      var p1 = player1;
      var p2 = player2;
      if (curPlayer == "p1") {
        setPlayer1(e.target.value);
        p1 = e.target.value;
      } else if (curPlayer == "p2") {
        setPlayer2(e.target.value);
        p2 = e.target.value;
      } else {
        setPlayer1("TODO: Spectator Cases");
      }

      //for updating backend with new player name
      roomSocket.send(
        JSON.stringify({
          player1: p1,
          player2: p2,
          player1Color: player1Color,
          player2Color: player2Color,
          turn: turn.toString(),
          new_move_x: -1,
          new_move_y: -1,
        })
      );
      setNameForm(!nameForm);
    }
  }

  function setName(e) {
    e.stopPropagation();
    setNameForm(!nameForm);
  }

  function setColor(rgb) {
    var p1 = player1Color;
    var p2 = player2Color;
    if (curPlayer == "p1") {
      if (rgb != player2Color) {
        p1 = rgb;
        setPlayer1Color(rgb);
      }
    } else if (curPlayer == "p2") {
      if (rgb != player1Color) {
        p2 = rgb;
        setPlayer2Color(rgb);
      }
    } else {
      //TODO: Spectator Case
      console.log(
        "You Are considered a spectator. Change Color will not work for now :("
      );
    }

    roomSocket.send(
      JSON.stringify({
        player1: player1,
        player2: player2,
        player1Color: p1,
        player2Color: p2,
        turn: turn.toString(),
        new_move_x: -1,
        new_move_y: -1,
      })
    );
    handleClose();
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid container xs={12} sm={8}>
          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "white", color: "black" }}>
              <LinearProgress
                variant="determinate"
                value={65}
                color="primary"
                style={{ height: "1em" }}
              />
              <LinearProgress
                variant="determinate"
                value={65}
                color="primary"
              />
            </Paper>
          </Grid>
          <Grid container justify="center" xs={12} sm={12}>
            {/* wait until everything is fetched from the API first (render "Loading...") */}
            {player1 && player2 && player1Color && player2Color && curPlayer ? (
              <>
                {curPlayer != "p1" ? (
                  <Paper
                    variant="outlined"
                    style={{
                      backgroundColor:  player1Color,
                      color: "black",
                      width: "61.5%",
                      border: !turn? "transparent":"2px solid black",
                      borderRadius: "2px"
                    }}
                  >
                    <FormControl>
                      <Typography>
                        {player1}
                        {"🗿"}
                      </Typography>
                    </FormControl>
                  </Paper>
                ) : (
                  <Paper
                    // elevation={24}
                    variant = "outlined"
                    style={{
                      backgroundColor: player2Color,
                      color: "black",
                      width: "61.5%",
                      border: turn? "transparent":"2px solid black",
                      borderRadius: "0px"
                    }}
                    square 
                  >
                    <FormControl>
                      <Typography>
                        {player2.substr(0, 3) == "TMP"
                          ? "Waiting for Opponent to Join..."
                          : player2}{" "}
                        {AI ? "🤖" : "🗿"}
                      </Typography>
                    </FormControl>
                  </Paper>
                )}
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Grid>
          <Grid container justify="center" xs={12} sm={12}>
            <Paper
              style={{
                backgroundColor: "black",
                color: "black",
                width: "61.5%"
              }}
            >
              <Goban
                board={board}
                boardColor="#f4bc7c"
                // annotations={annotations}
                onCoordinateClick={handleCoordinateClick}
              />
            </Paper>
          </Grid>
          <Grid container justify="center" xs={12} sm={12}>
            {player1 && player2 && player1Color && player2Color && curPlayer ? (
              <>
                {curPlayer == "p1" ? (
                  <Paper
                    style={{
                      backgroundColor: player1Color,
                      color: player1Color,
                      width: "61.5%",
                      border: !turn? "transparent":"2px solid black",
                      borderRadius: "2px"
                    }}
                    onClick={() =>
                      nameForm ? handleClickOpen() : console.log("null")
                    }
                  >
                    <FormControl>
                      {nameForm ? (
                        <InputBase
                          defaultValue={player1}
                          inputProps={{ "aria-label": "naked" }}
                          onClick={setName}
                        />
                      ) : (
                        <>
                          <InputLabel htmlFor="my-input">{player1}</InputLabel>
                          <Input
                            id="my-input"
                            aria-describedby="my-helper-text"
                            onKeyDown={changeName}
                          />
                          <FormHelperText id="my-helper-text">
                            Press ENTER to change your name.
                          </FormHelperText>
                        </>
                      )}
                    </FormControl>
                  </Paper>
                ) : (
                  <Paper
                    style={{
                      backgroundColor: player2Color,
                      color: player2Color,
                      width: "61.5%",
                      border: turn? "transparent":"2px solid black",
                      borderRadius: "2px"
                    }}
                    onClick={() => (nameForm ? handleClickOpen() : null)}
                  >
                    <FormControl>
                      {nameForm ? (
                        <InputBase
                          defaultValue={player2}
                          inputProps={{ "aria-label": "naked" }}
                          onClick={setName}
                        />
                      ) : (
                        <>
                          <InputLabel htmlFor="my-input">{player2}</InputLabel>
                          <Input
                            id="my-input"
                            aria-describedby="my-helper-text"
                            onKeyDown={changeName}
                          />
                          <FormHelperText id="my-helper-text">
                            Press ENTER to change your name.
                          </FormHelperText>
                        </>
                      )}
                    </FormControl>
                  </Paper>
                )}
              </>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Grid>
        </Grid>
        <Grid container xs={12} sm={4}>
          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              {player1Color}
            </Paper>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "grey", color: "black" }}>
              sa
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

      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Pick A Color</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid container item xs={6} spacing={3}>
              <Grid item item xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#4791db" }}
                  onClick={() => setColor("#4791db")}
                >
                  #4791db
                </Paper>
              </Grid>
              <Grid item item xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#e33371" }}
                  onClick={() => setColor("#e33371")}
                >
                  #e33371
                </Paper>
              </Grid>
              <Grid item item xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#81c784" }}
                  onClick={() => setColor("#81c784")}
                >
                  #81c784
                </Paper>
              </Grid>
            </Grid>
            <Grid container item xs={6} spacing={3}>
              <Grid item className={classes.paper} item xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#e57373" }}
                  onClick={() => setColor("#e57373")}
                >
                  #e57373
                </Paper>
              </Grid>
              <Grid item className={classes.paper} xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#ffb74d" }}
                  onClick={() => setColor("#ffb74d")}
                >
                  #ffb74d
                </Paper>
              </Grid>
              <Grid item className={classes.paper} xs={12} spacing={3}>
                <Paper
                  className={classes.paper}
                  style={{ backgroundColor: "#64b5f6" }}
                  onClick={() => setColor("#64b5f6")}
                >
                  #64b5f6
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

