import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Grid, FormHelperText, FormControl, FormControlLabel, Typography, TextField, Button, Radio, RadioGroup} from '@material-ui/core'

function CreateRoomPage() {
  const [guestCanPause, setGuestCanPause ] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const navigate = useNavigate();

  const handleVotesChanged = (e) => {
    setVotesToSkip(e.target.value);
  }
  const handleGuestCanPauseChange = (e) => {
    setGuestCanPause(e.target.value === 'true' ? true : false);
  }
  const handleRoomBtnPressed = () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ votes_to_skip: votesToSkip, guest_can_pause: guestCanPause})
    };

    fetch('/api/create-room', options)
      .then((response) => response.json())
      .then(({ code }) => {
        const path = `/room/${code}`
        navigate(path)
      });
  }


  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Typography component='h4' variant='h4'>
          Create A Room
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <span align="center">Guest Control</span>
          </FormHelperText>
          <RadioGroup row defaultValue="true" onChange={handleGuestCanPauseChange}>
            <FormControlLabel
              value="true"
              control={<Radio color="primary" />}
              label="Play/Pause"
              labelPlacement="bottom">
            </FormControlLabel>
            <FormControlLabel
              value="false"
              control={<Radio color="secondary" />}
              label="No Control"
              labelPlacement="bottom">
            </FormControlLabel>
          </RadioGroup>
        </FormControl>
      </Grid>

      <Grid item xs={12} align="center">
        <FormControl>
          <TextField
            required={true}
            type="number"
            onChange={handleVotesChanged}
            defaultValue={votesToSkip}
            inputProps={{
              min: 1,
              style: { textAlign: "center"}
            }}
          />
          <FormHelperText>
            <span align="center">Votes Required To Skip</span>
          </FormHelperText>
        </FormControl>
      </Grid>

      <Grid item xs={12} align="center">
        <Button color="primary" variant="contained" onClick={handleRoomBtnPressed}>
          Create A Room
        </Button>
      </Grid>

      <Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>

    </Grid>
  )
}

export default CreateRoomPage;