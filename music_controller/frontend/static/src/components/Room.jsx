import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import MusicPlayer from './MusicPlayer.jsx';

function Room(props) {
  const [song, setSong] = useState()
  const [polling, setPolling] = useState(0);
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/spotify/current-song')
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          return {};
        }
        return response.json()
      })
      .then((data) => {
        setSong(data)
        // console.log('current song', data) // DELETE ME
      });
      // setInterval(() => setPolling(polling + 1), 1000)
  }, [polling])

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
  };

  return(
    <Grid container spacing={1}>

      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h6">
          Code: {props.roomCode}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center" >
        <Grid xs={6} align="center">
          <MusicPlayer {...song} />
        </Grid>
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
