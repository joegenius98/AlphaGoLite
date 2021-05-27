import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { Link } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

//black color
const ColorButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#000",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
}))(Button);

//white color
const NotColorButton = withStyles((theme) => ({
  root: {
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#000",
    },
  },
}))(Button);

function CustomizedButtons(props) {
  const classes = useStyles();

  return (
    <>
      {/* if it's player 1's turn,  */}
      {!props.turn ? (
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
            </ColorButton>
          </Grid>
        </>
      ) : (
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
            </NotColorButton>
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
      turn: true,
    };

    this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
    this.handleTurnChange = this.handleTurnChange.bind(this);
  }

  handleTurnChange(val) {
    this.setState({
      turn: val,
    });
  }

  handleRoomButtonPressed(AI) {
    /*
    -Do we want the initial board to be created by the host in the frontend,
    or do we want the board created in the backend? 
    -Note: turn==true => host/player1 goes first
    */
    // var value = 0; // by default
    // var myGrid = [...Array(19)].map((e) => Array(19).fill(value));
    // this.setState({ board: myGrid });
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        turn: this.state.turn,
        // board: JSON.stringify(myGrid),
        AI:AI,
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
              turn={this.state.turn}
              change={this.handleTurnChange}
            />
          </Grid>
          <Grid container item xs={3} spacing={3} align="center">
            <React.Fragment>
              <Grid item xs={12}>
                {this.state.turn ? (
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
            onClick={()=>this.handleRoomButtonPressed(true)}
          >
            Play with AI
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            color="primary"
            variant="contained"
            onClick={()=>this.handleRoomButtonPressed(false)}
          >
            Play against friends
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
