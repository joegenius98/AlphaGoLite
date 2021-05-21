import React, { Component } from "react";
import godash from "godash";
import { Goban } from "react-go-board";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: "red",

    minHeight: "100vh",
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Room() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="column"
        justify="space-evenly"
        alignItems="center"
        style={{ minHeight: "700px" }}
      >
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
          style={{ minHeight: "700px" }}
        >
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="center"
          // style={{ }}
        >
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-end"
          style={{ position: "absolute" }}
        >
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Paper className={classes.paper}>Bar Column</Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}

// <div>
//   <h3>{this.roomCode}</h3>
//   <p>Votes: {this.state.votesToSkip}</p>
/* <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
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
