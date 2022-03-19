import React, { useState, useEffect } from 'react'
import { Grid, Button } from '@material-ui/core'
import CreateRoomPage from './CreateRoomPage.jsx'

function Settings({ updateShowSettings, votesToSkip, guestCanPause, roomCode, updateCallBack }) {
  return(
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <CreateRoomPage
          update={true}
          votesToSkip={votesToSkip}
          guestCanPause={guestCanPause}
          roomCode={roomCode}
          // updateCallBack={}
        />
      </Grid>

      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" onClick={updateShowSettings}>Close</Button>
      </Grid>

    </Grid>
  )
}

export default Settings;