import React, { useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Grid, Typography, TextField, Button} from '@material-ui/core'

function JoinRoomPage() {
  const [roomCode, setRoomCode] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleTextFieldChange = (e) => {
    setRoomCode(e.target.value)
  }
  const roomBtnPress = () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        code: roomCode,
      }),
    };

    fetch('/api/join-room', options)
      .then((response) => {
        if (response.ok) {
          const path = `/room/${roomCode}`
          navigate(path)
        } else {
          setErr('Room not found')
          setRoomCode('');
        }
      })
      .catch((error) => console.log(error));
  }

  return (
    <Grid container spacing={1}>

      <Grid item xs={12} align="center">
        <Typography variant="h4" component="h4">
          Join A Room
        </Typography>
      </Grid>

      <Grid item xs={12} align="center">
        <TextField
          error={(err === '') ? false : true}
          label="code"
          placeholder="Enter a room code"
          value={roomCode}
          helperText={err}
          variant="outlined"
          onChange={handleTextFieldChange}
        />
      </Grid>

      <Grid item xs={12} align="center">
      <Button variant="contained" color="primary" onClick={roomBtnPress}>Enter Room</Button>
      </Grid>

      <Grid item xs={12} align="center">
        <Button variant="contained" color="secondary" to="/" component={Link}>Back</Button>
      </Grid>
    </Grid>
  )
}

export default JoinRoomPage;