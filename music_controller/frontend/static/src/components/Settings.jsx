import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@mui/material'
import CreateRoomPage from './CreateRoomPage.jsx'

function Settings(props) {
  return(
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={props.votesToSkip}
          setVotesToSkip={props.setVotesToSkip}
          guestCanPause={props.guestCanPause}
          setGuestCanPause={props.setGuestCanPause}
          roomCode={props.roomCode}
        />
      </Grid>

      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={props.updateShowSettings}>Close</Button>
      </Grid>

    </Grid>
  )
}

export default Settings;