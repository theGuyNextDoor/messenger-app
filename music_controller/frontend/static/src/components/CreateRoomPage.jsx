import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Grid, FormHelperText, FormControl, FormControlLabel, Typography, TextField, Button, Radio, RadioGroup, Collapse } from '@mui/material'
import Alert from '@material-ui/lab/Alert'

function CreateRoomPage(props) {
  const [successMsg, setSuccessMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const navigate = useNavigate();
  const title = props.update ? 'Update Room' : 'Create A Room';
  const btnTitle = props.update ? 'Update Room Settings' : 'Create Room';

  const handleVotesChanged = (e) => {
    props.setVotesToSkip(e.target.value);
  }
  const handleGuestCanPauseChange = (e) => {
    props.setGuestCanPause(e.target.value === 'true' ? true : false);
  }
  const handleCreateBtnPressed = () => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({ votes_to_skip: props.votesToSkip, guest_can_pause: props.guestCanPause})
    };

    fetch('/api/create-room', options)
      .then((response) => response.json())
      .then(({ code }) => {
        const path = `/room/${code}`
        navigate(path)
      });
  }
  const handleUpdateBtnPressed = () => {
    const options = {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json'},
      body: JSON.stringify({
        votes_to_skip: props.votesToSkip,
        guest_can_pause: props.guestCanPause,
        code: props.roomCode
      })
    };

    fetch('/api/update-room', options)
      .then((response) => {
        if (response.ok) {
          setSuccessMsg('Room Updated');
          return response.json()
        } else {
          setErrMsg('Error updating room')
        }
      })
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} align="center">
        <Collapse in={successMsg !== '' || errMsg !== ''}>
          {successMsg !== '' ?
          (<Alert severity="success" onClose={()=> setSuccessMsg('')}>{successMsg}</Alert>)
          :
          (<Alert severity="error" onClose={()=> setErrMsg('')}>{errMsg}</Alert>)}
        </Collapse>
      </Grid>

      <Grid item xs={12} align="center">
        <Typography component='h4' variant='h4'>
          {title}
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <FormControl component="fieldset">
          <FormHelperText>
            <span align="center">Guest Control</span>
          </FormHelperText>
          <RadioGroup row value={props.guestCanPause.toString()} onChange={handleGuestCanPauseChange}>
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
            defaultValue={props.votesToSkip}
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
        <Button
          color="primary"
          variant="contained"
          onClick={props.update ? handleUpdateBtnPressed : handleCreateBtnPressed}
        >
          {btnTitle}
        </Button>
      </Grid>

      {!props.update && (<Grid item xs={12} align="center">
        <Button color="secondary" variant="contained" to="/" component={Link}>
          Back
        </Button>
      </Grid>)}

    </Grid>
  )
}

export default CreateRoomPage;