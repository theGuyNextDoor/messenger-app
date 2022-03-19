import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useParams, useNavigate } from 'react-router-dom'

function Room({ setRoomCallback, updateShowSettings, votesToSkip, guestCanPause, isHost, showSettings, roomCode }) {
  const navigate = useNavigate()

  const leaveButtonPress = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    };
    fetch('/api/leave-room', options)
      .then((response) => {
        const path = '/';

        setRoomCallback(null);
        navigate(path);
      })
  }

  return(
    <Grid container spacing={1}>

      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h6">
          Code: {roomCode}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Votes To Dkip: {votesToSkip}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Guest Can Pause: {guestCanPause.toString()}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography variant="h6" component="h6">
          Is Host: {isHost.toString()}
        </Typography>
      </Grid>

      {!showSettings && (<Grid item xs={12} align="center">
         <Button color="primary" variant="contained" onClick={updateShowSettings}>
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
