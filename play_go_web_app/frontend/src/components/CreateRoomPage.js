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
on what user clicks. the default is side black. 
ColorButton is rendered for the side you choose and
NotcolorButton is rendered for the side you don't choose.

Parameters
----------
props.change = handleTurnChange in CreateRoomPage class
props.turn = CreateRoomPage.state.p1Turn
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
        // true <--> black color chosen
        // false <--> white color chosen
        // this is because black always goes first before white
        // Also, the creator of the room is player 1. Thsi boolean helps with determining
        // when to play/turn logic.
        this.state = {
            p1Turn: true,
        };

        this.handleRoomButtonPressed = this.handleRoomButtonPressed.bind(this);
        this.handleTurnChange = this.handleTurnChange.bind(this);
    }

    handleTurnChange(val) {
        this.setState({
            p1Turn: val,
        });
    }

    /*
  parameter "AI" tells whether the player wants to face the A.I. 
  This method sends a POST request to the Django view method of creating a room
  */
    handleRoomButtonPressed(AI) {
        console.log(
            "Inside of CreateRoomPage right before sending off to room:",
        );
        console.log(
            `Does player 1 go first?: ${this.state.p1Turn ? "yes" : "no"}`,
        );
        const requestOptions = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                player1_turn: this.state.p1Turn,
                AI: AI, // for clarity, the AI is always player 2
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
                            turn={this.state.p1Turn}
                            change={this.handleTurnChange}
                        />
                    </Grid>
                    <Grid container item xs={3} spacing={3} align="center">
                        <React.Fragment>
                            <Grid item xs={12}>
                                {this.state.p1Turn ? (
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
                    <Button
                        color="secondary"
                        variant="contained"
                        to="/"
                        component={Link}
                    >
                        Back
                    </Button>
                </Grid>
            </Grid>
        );
    }
}
export default CreateRoomPage;
