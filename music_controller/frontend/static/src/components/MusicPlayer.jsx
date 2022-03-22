import React, { useState } from 'react';
import { Grid, Typography, Card, IconButton, LinearProgress } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import SkipNextIcon from '@mui/icons-material/SkipNext';

function MusicPlayer(props) {
  const songProgress = (props.time / props.duration) * 100;

  const controlSong = () => {
    let action = props.is_playing ? 'pause' : 'play';
    const options ={
      method: 'PUT',
      headers: {'Content-Type': 'application/json'}
    }

    fetch(`/spotify/${action}`, options)
  };
  const skipSong = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
    };
    fetch('/spotify/skip', options)
  }

  return(
    <Card>
      <Grid container alignItems="center">

        <Grid item align="center" xs={4}>
          <img src={props.image_url} height="100%" width="100%" />
        </Grid>

        <Grid item align="center" xs={8}>
          <Typography component="h4" variant="h5">
            {props.title}
          </Typography>
          <Typography color="textSecondary" variant="subtitle1">
            {props.artist}
          </Typography>
          <div>

            <IconButton onClick={controlSong} >
              {
                props.is_playing ?
                <PauseIcon />
                :
                <PlayArrowIcon />
              }
            </IconButton>

            <IconButton onClick={skipSong}>
              <SkipNextIcon /> {props.votes} / {props.votes_required}
            </IconButton>

          </div>
        </Grid>

      </Grid>
      <LinearProgress variant="determinate" value={songProgress}>
      </LinearProgress>
    </Card>
  )
}

export default MusicPlayer;
