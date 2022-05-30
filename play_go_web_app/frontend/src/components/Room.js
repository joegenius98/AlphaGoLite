import React, { useState, useEffect, useRef } from "react";
import godash from "godash";
import { Goban } from "react-go-board";
import { makeStyles } from "@material-ui/core/styles";
import {
  Button,
  LinearProgress,
  Paper,
  Grid,
  // Select,
  FormControl,
  // MenuItem,
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

import { userColorChoices } from "./UserColors.js";

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

/*
This component renders a game room, with:
  * a board to view live gameplay
* usernames of the players (A.I. has auto-generated, distinguishable nickname)
* color bars of their players (a personalization of the choice; this is apart
  * from the color piece they are, black or white)
  * TODO: a live chat room 
*/

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

  //board info.
  const [board, setBoard] = useState(new godash.Board(19)); //to convert board string backend/socket data --> frontend representation
  const boardStrArr = useRef("0".repeat(19 * 19).split("")); // to convert board string frontend --> backend/socket data representation

  //player info.
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [player1Color, setPlayer1Color] = useState("null");
  const [player2Color, setPlayer2Color] = useState("null");
  const [currTurn, setCurrTurn] = useState(true);
  const [curPlayer, setCurPlayer] = useState("null");
  // const [age, setAge] = React.useState("");

  // for A.I. player
  const AI = useRef(false);
  // boolean values, compared to currTurn value to determine whose turn it is
  const p1Turn = useRef(false);
  const p2Turn  = useRef(false);

  // facilitating changing player's info.
  const [nameForm, setNameForm] = useState(true); // boolean to toggle on/off name changing 
  const [open, setOpen] = useState(false); // boolean as to whether to display color customization options

  //room info.
  const ROOM_CODE = window.location.pathname.slice(
    window.location.pathname.lastIndexOf("/") + 1
  );

  const roomSocket = useRef(
    new WebSocket(`wss://${window.location.host}/wss/rooms/${ROOM_CODE}/`)
  );

  const handleChange = (event) => {
    setAge(Number(event.target.value) || "");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /*
    called upon every time an update to the room is made to send 
    to other people in the same room
  */
  roomSocket.current.onmessage = function (e) {
    console.log("RoomSocket onmessage running");
    const data = JSON.parse(e.data);
    console.log(data);

    if ("player1" in data) setPlayer1(data.player1);
    if ("player2" in data) setPlayer2(data.player2);

    if ("player1Color" in data) setPlayer1Color(data.player1Color);
    if ("player2Color" in data) setPlayer2Color(data.player2Color);
    // convert string representation of board --> Godash board to then render on this client
    if ("board" in data) setBoard(getGodashBoard(data.board));
    // already checked that for sure, data.turn is a boolean and not a string
    if ("currTurn" in data) setCurrTurn(data.currTurn);

  };

  roomSocket.current.onclose = function (e) {
    console.error(e);
    console.error("Chat socket closed unexpectedly");
  };

  // converts board string representation to godash Board object
  function getGodashBoard(boardStr) {
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

  /*
  This method called upon a click by a player to update 
  the board character array to send to the Django backend.
  */
  function updateBoardStrArr(newBoard) {
    newBoard.moves.entrySeq().forEach((move) => {
      // console.log(move);
      boardStrArr.current[19 * move[0].y + move[0].x] =
        move[1] == "black" ? "1" : "2";
    });
  }

  //called every time a user joins/returns back to the room
  // TODO: fix problem where upon refresh, player is stuck as as a spectator
  useEffect((props) => {
    console.log("useEffect in use");
    function leaveRoom() {
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        };
        fetch("/api/leave-room", requestOptions).then((_response) => {});
    };
    function getRoom() {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };

      // load room details from database
      fetch("/api/get-room" + "?code=" + ROOM_CODE, requestOptions)
        .then((response) => response.json())
        .then((responseJSON) => {
          console.log("fetch method inside useEffect being used");

          // currTurn value: True at first and then switches for every player's turn
          setCurrTurn(responseJSON.curr_turn);
          // the "AI" boolean (whether there is one)
          AI.current = responseJSON.AI;
          p1Turn.current = responseJSON.player1_turn;
          p2Turn.current = responseJSON.player2_turn;

          // do stuff with responseJSON here...
          //use let keyword inside of this function scope
          console.log(responseJSON);
          let p1;
          let p2;
          //the first person who joins room = player 1, regardless of color piece chosen (both players have "TMP" in front)
          if (responseJSON.player1.substring(0, 3) == "TMP") {
            //strip off "TMP" from player 1 and set it as player
            p1 = responseJSON.player1.substring(3);
            p2 = responseJSON.player2;
            setCurPlayer("p1");
            setPlayer1(p1);
            setPlayer2(p2);

            
            let data = {player1: p1};
            
            // Let the A.I. make the move if it exists and it is its turn
            if (AI.current)
            {
              data.board = responseJSON.board;
              data.currTurn = currTurn;
              data.p2Turn = p2Turn.current;
              data.AI = true;
            }
            
            data = JSON.stringify(data);
            console.log(data);
            
            console.log(roomSocket.current);
            if (roomSocket.current.readyState == WebSocket.OPEN)
              roomSocket.current.send(data);
            else if (roomSocket.current.readyState == WebSocket.CONNECTING)
              // prettier-ignore
              roomSocket.current.addEventListener("open", event => roomSocket.current.send(data));
          }

          //if player 2 (as a human) joins next
          // TODO this case
          else if (responseJSON.player2.substring(0, 3) == "TMP" && !AI.current) {
            //strip off "TMP" from player 2 and set it as player
            p1 = responseJSON.player1;
            p2 = responseJSON.player2.substring(3);
            setCurPlayer("p2");
            setPlayer1(p1);
            setPlayer2(p2);

            let data = JSON.stringify({
              player2: p2,
            });

            if (roomSocket.current.readyState == WebSocket.OPEN)
              roomSocket.current.send(data);
            else if (roomSocket.current.readyState == WebSocket.CONNECTING)
              // prettier-ignore
              roomSocket.current.addEventListener("open", (event) => roomSocket.current.send(data));
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
          setPlayer1Color(responseJSON.player1_color);
          setPlayer2Color(responseJSON.player2_color);

          //render and update board representations
          // do NOT switch the order of these! setBoard first, then update board string array second
          var godashBrdObj = getGodashBoard(responseJSON.board);
          setBoard(godashBrdObj);

          // function needs to be re-instantiated here since useEffect is isolated from rest of code
          function updateBoardStrArrInUseEffect(newBoard) {
            console.log("updateBoardStrArrInUseEffect being called");

            // if there are any moves
            if (newBoard.moves.size > 0) {
              // console.log(newBoard.moves.size);
              newBoard.moves.entrySeq().forEach((move, ind) => {
                // console.log(move);
                boardStrArr.current[ind] = move[1] === "black" ? "1" : "2";
              });
            }
          }

          // updateBoardStrArrInUseEffect(godashBrdObj);
          console.log(boardStrArr.current.toString());
        });
    }
    getRoom();

  
    // window.addEventListener("beforeunload", leaveRoom);
    return () => {
      // window.removeEventListener("beforeunload", leaveRoom);
    };
  }, []); //empty array ensures that useEffect is only ran upon inital rendering of room, not with every re-render (e.g. it
  // occurs whenever a React state changes)

  var new_board = null;
  var colorPiece = null;

  /*
  handles cursor click to make a move on Go board and then passes onto
  socket to send new move information across all viewers and the other player (including AI)
  */
  function handleCoordinateClick(coordinate) {
    // prettier-ignore
    // all cases where somebody attempts to make a move when it is not his/her/(whatever pronoun) turn
    //if there is no A.I. and the other human player attempts to go while the other playing is deciding a move
    //OR if the spectator is trying to make a move
    //OR it is the A.I.'s turn and the human is trying to make move
    if (
      (!AI.current && (
      (curPlayer === "p1" && currTurn != p1Turn.current) || (curPlayer === "p2" && currTurn != p2Turn.current))) ||
      curPlayer === "spectator" || player2.substring(0, 3) == "TMP") 
    {
      console.log(player2);
      console.log(`AI:${AI.current}`);
      console.log("Not allowed to click during the other player's turn!");
      console.log("p2Turn, currTurn, current player");
      console.log(p2Turn.current, currTurn, curPlayer);
      return;
    }
    try {
      
      colorPiece =  curPlayer === "p1" ? (
        p1Turn.current === true ? godash.BLACK : godash.WHITE) : (p2Turn.current === true ? godash.BLACK : godash.WHITE)
      new_board = godash.addMove(board, coordinate, colorPiece);
      // this setBoard was here to trigger a re-render so that all clients (people who view the room) can have the board updated.
      
      setBoard(new_board);
      //update string array representation of board
      updateBoardStrArr(new_board);
      console.log(
        `HandleCoordinateClick: board string arr: ${boardStrArr.current.toString()}`
      );
      // console.log(
      //   `coordinate: (${e[0].x}, ${
      //     e[0].y
      //   }), value type: ${typeof e[1]}, value: ${e[1]}, index:${ind}`
      // )

      //for updating backend with new board and to send to other clients too
      // of course we need to update the current turn value for this frontend as well
      let data = JSON.stringify({
        AI: AI.current,
        currTurn: !currTurn,
        p2Turn: p2Turn.current,
        board: boardStrArr.current.join(""),
      });
      setCurrTurn(!currTurn);

      if (roomSocket.current.readyState == WebSocket.OPEN)
        roomSocket.current.send(data);
      else
        // prettier-ignore
        roomSocket.current.addEventListener("open", (event) => roomSocket.current.send(data));

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

  // customization function to change the name of one's player
  function changeName(e) {
    e.stopPropagation(); // since the color bar customization is overlaid by the name display, we
    // want to stop propagation from changing name to then color customization; we just want to change the name
    if (e.key === "Enter") {
      let p1 = player1;
      let p2 = player2;
      if (curPlayer == "p1") //prettier-ignore 
      {
        setPlayer1(e.target.value);
        p1 = e.target.value;
        if (roomSocket.current.readyState == WebSocket.OPEN)
          roomSocket.current.send(JSON.stringify({player1: p1})); //prettier-ignore
        else
          roomSocket.current.addEventListener(
            "open", roomSocket.current.send(JSON.stringify({player1: p1}))); //prettier-ignore
        //prettier-ignore
      }
      //prettier-ignore
      else if (curPlayer == "p2") 
      {
        setPlayer2(e.target.value);
        p2 = e.target.value;
        if (roomSocket.current.readyState == WebSocket.OPEN)
          roomSocket.current.send(JSON.stringify({player2: p2})); //prettier-ignore
        else
          roomSocket.current.addEventListener(
            "open", roomSocket.current.send(JSON.stringify({player2: p2})) //prettier-ignore
          );
      } 
      // prettier-ignore
      else {
        alert("TODO: Spectator Cases");
      }

      setNameForm(!nameForm);
    }
  }

  function setName(e) {
    e.stopPropagation();
    setNameForm(!nameForm);
  }

  // customization function to change the color of a player's bar color surrounding name
  function setColor(rgb) {
    if (curPlayer == "p1") //prettier-ignore
    {
      if (rgb != player2Color) {
        let p1Col = rgb;
        setPlayer1Color(rgb);

        
        if (roomSocket.current.readyState == WebSocket.OPEN)
          roomSocket.current.send(JSON.stringify({player1Color: p1Col})); //prettier-ignore
        else
          roomSocket.current.addEventListener(
            "open", roomSocket.current.send(JSON.stringify({player1Color: p1Col})) //prettier-ignore
          );

      } else {
        console.log("You cannot select the same color as the opponent!");
      }
    } 
    
    else if (curPlayer == "p2") // prettier-ignore
    {
      if (rgb != player1Color) {
        let p2Col = rgb;
        setPlayer2Color(rgb);

        if (roomSocket.current.readyState == WebSocket.OPEN)
          roomSocket.current.send(JSON.stringify({player2Color: p2Col})); //prettier-ignore
        else
          roomSocket.current.addEventListener(
            "open", roomSocket.current.send(JSON.stringify({player2Color: p2Col})) //prettier-ignore
          );

      } else {
        alert("You cannot select the same color as the opponent!");
      }
    } 
    
    else // prettier-ignore
    {
      //TODO: Spectator Case
      alert("You are a spectator. You shan't change the color of players.");
    }

    handleClose();
  }
  return (
    <div className={classes.root}>
      <Grid container spacing={24}>
        <Grid container xs={12} sm={8}>
          <Grid item xs={12} sm={12}>
            <Paper style={{ backgroundColor: "white", color: "black" }}>
              {/* TODO: figure out what linear progress bar is for */}
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
                {/* if this client is p2 or spectator, render p1 at the top bar, otherwise at the bottom bar*/}
                {curPlayer !== "p1" ? (
                  <Paper
                    variant="outlined"
                    style={{
                      backgroundColor: player1Color,
                      color: "black",
                      width: "61.5%",
                      border: currTurn == p2Turn.current ? "2px solid black" : "transparent",
                      borderRadius: "2px",
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
                    variant="outlined"
                    style={{
                      backgroundColor: player2Color,
                      color: "black",
                      width: "61.5%",
                      border: currTurn == p1Turn.current ? "2px solid black" : "transparent",
                      borderRadius: "0px",
                    }}
                    square
                  >
                    <FormControl>
                      <Typography>
                        {player2.substring(0, 3) == "TMP"
                          ? "Waiting for Opponent to Join..."
                          : player2}{" "}
                        {AI.current ? "🤖" : "🗿"}
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
                width: "61.5%",
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
                {curPlayer === "p1" ? (
                  <Paper
                    style={{
                      backgroundColor: player1Color,
                      color: player1Color,
                      width: "61.5%",
                      border:currTurn == p1Turn.current ? "2px solid black" : "transparent",
                      borderRadius: "2px",
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
                      border: currTurn == p2Turn.current ? "2px solid black" : "transparent",
                      borderRadius: "2px",
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

        {/* disableEscapeKeyDown is not needed as Dialog param. (I think); users should have
        a choice in exiting out if they do not desire to change their color*/}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Pick A Color</DialogTitle>
        <DialogContent>
          <Grid container spacing={1}>
            <Grid container item xs={6} spacing={3}>
              {userColorChoices.slice(0, 3).map((hexColor) => {
                return (
                  <Grid item xs={12} spacing={3}>
                    <Paper
                      className={classes.paper}
                      style={{ backgroundColor: hexColor }}
                      onClick={() => setColor(hexColor)}
                    >
                      {hexColor}
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
            <Grid container item xs={6} spacing={3}>
              {userColorChoices.slice(3).map((hexColor) => {
                return (
                  <Grid item xs={12} spacing={3}>
                    <Paper
                      className={classes.paper}
                      style={{ backgroundColor: hexColor }}
                      onClick={() => setColor(hexColor)}
                    >
                      {hexColor}
                    </Paper>
                  </Grid>
                );
              })}
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
