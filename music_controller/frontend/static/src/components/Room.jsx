import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useParams, useNavigate } from 'react-router-dom'

function Room(props) {
  const navigate = useNavigate()

  const leaveButtonPress = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    };
    fetch('/api/leave-room', options)
      .then((response) => {
        const path = '/';

        props.setRoomCallback(null);
        navigate(path);
      })
  }

  return(
    <Grid container spacing={1}>

      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h6">
          Code: {props.roomCode}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes To Skip: {props.votesToSkip}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {props.guestCanPause.toString()}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Is Host: {props.isHost.toString()}
        </Typography>
      </Grid>

      {!props.showSettings && (<Grid item xs={12} align="center">
         <Button color="primary" variant="contained" onClick={props.updateShowSettings}>
          Settings
        </Button>
      </Grid>)}

      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" onClick={leaveButtonPress}>
          Leave Room
        </Button>
      </Grid>

    </Grid>
  )
}

export default Room;
