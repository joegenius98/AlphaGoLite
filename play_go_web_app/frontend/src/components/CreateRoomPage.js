import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

/*
This component renders the "Create Room" page, with option to choose black or white
and whether to play with a friend or with the A.I.

Whichiever player (even the A.I.) that is black goes first.
*/

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

//#000 --> black
//#fff --> white

//Every Button has its indicated token color in the middle.

// ColorButton indicates selected color piece with black background
const ColorButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#000",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
}))(Button);

//NotColorButton renders the non-selected color piece with white background
const NotColorButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#000",
    },
  },
}))(Button);

function BlackCircle() {
  return (
    <svg width="100%" height="100%">
      <circle
        cx="50%"
        cy="50%"
        r="10%"
        stroke="white"
        strokeWidth="4"
        fill="black"
      />
    </svg>
  );
}

function WhiteCircle() {
  return (
    <svg width="100%" height="100%">
      <circle
        cx="50%"
        cy="50%"
        r="10%"
        stroke="black"
        strokeWidth="4"
        fill="white"
      />
    </svg>
  );
}

/*
 Renders choice of side black or white based
on what user clicks.
props.change = handleTurnChange in CreateRoomPage class
props.turn = CreateRoomPage.state.isHumanPlayerFirst
*/
function CustomizedButtons(props) {
  const classes = useStyles();

  return (
    <>
      {props.turn ? (
        <>
          <Grid item xs={6}>
            <ColorButton
              onClick={() => {
                props.change(true);
              }}
              variant="contained"
              color="primary"
              className={classes.margin}
            >
              <BlackCircle />
            </ColorButton>
          </Grid>
          <Grid item xs={6}>
            <NotColorButton
              onClick={() => {
                props.change(false);
              }}
              variant="contained"
              color="primary"
              className={classes.margin}
            >
              <WhiteCircle />
            </NotColorButton>
          </Grid>
        </>
      ) : (
        <>
          <Grid item xs={6}>
            <NotColorButton
              onClick={() => {
                props.change(true);
              }}
              variant="contained"
              color="primary"
              className={classes.margin}
            >
              <BlackCircle />
            </NotColorButton>
          </Grid>
          <Grid item xs={6}>
            <ColorButton
              onClick={() => {
                props.change(false);
              }}
              variant="contained"
              color="primary"
              className={classes.margin}
            >
              <WhiteCircle />
            </ColorButton>
          </Grid>
        </>
      )}
    </>
  );
}

class CreateRoomPage extends Component {
  defaultVotes = 2;
  constructor(props) {
    super(props);
    this.state = {
      isHumanPlayerFirst: true,
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleTurnChange = this.handleTurnChange.bind(this);
  }

  handleTurnChange(val) {
    this.setState({
      isHumanPlayerFirst: val,
    });
  }

  /*
  parameter "AI" tells whether the player wants to face the A.I. 
  */
  handleRoomButtonPressed(AI) {
    /*
    -Do we want the initial board to be created by the host in the frontend,
    or do we want the board created in the backend? 
    -Note: turn==true => host/player1 goes first
    */
    // var value = 0; // by default
    // var myGrid = [...Array(19)].map((e) => Array(19).fill(value));
    // this.setState({ board: myGrid });
    console.log("Inside of CreateRoomPage right before sending off to room:");
    console.log(
      `Is human player first?: ${this.state.isHumanPlayerFirst ? "yes" : "no"}`
    );
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        is_human_player_first: this.state.isHumanPlayerFirst,
        // board: JSON.stringify(myGrid),
        AI: AI,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  render() {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            Create A Room
          </Typography>
        </Grid>

        <Grid item xs={12} spacing={3} align="center">
          <Grid container item xs={3} spacing={3}>
            <CustomizedButtons
              turn={this.state.isHumanPlayerFirst}
              change={this.handleTurnChange}
            />
          </Grid>
          <Grid container item xs={3} spacing={3} align="center">
            <React.Fragment>
              <Grid item xs={12}>
                {this.state.isHumanPlayerFirst ? (
                  <Typography component="h6" variant="h6">
                    Black
                  </Typography>
                ) : (
                  <Typography component="h6" variant="h6">
                    White
                  </Typography>
                )}
              </Grid>
            </React.Fragment>
          </Grid>
        </Grid>

        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.handleRoomButtonPressed(true)}
          >
            Play with AI
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={() => this.handleRoomButtonPressed(false)}
          >
            Play with Friend
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="secondary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }
}
export default CreateRoomPage;
