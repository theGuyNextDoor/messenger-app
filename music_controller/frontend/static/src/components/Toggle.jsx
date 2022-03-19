import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@material-ui/core'
import { useParams, useNavigate } from 'react-router-dom'
import Room from './Room.jsx'
import Settings from './Settings.jsx'


function Toggle({ setRoomCallback }) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false)
  const { roomCode } = useParams()

  useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        // if (!response.ok) {
        //   setRoomCallback(null);
        //   const path = '/';
        //   navigate(path);
        return response.json();
      })
      .then((data) => {
        setVotesToSkip(data.votes_to_skip)
        setGuestCanPause(data.guest_can_pause)
        setIsHost(data.is_host)
      })
  }, [])

  const updateShowSettings = () => {
    setShowSettings(!showSettings);
  }
  if (showSettings) {
    return (
      <Settings
        updateShowSettings={updateShowSettings}
        votesToSkip={votesToSkip}
        guestCanPause={guestCanPause}
        roomCode={roomCode}
        // updateCallBack={updateCallBack}
      />
    )
  }
  return (
    <Room
      setRoomCallback={setRoomCallback}
      votesToSkip={votesToSkip}
      guestCanPause={guestCanPause}
      isHost={isHost}
      updateShowSettings={updateShowSettings}
      showSettings={showSettings}
      roomCode={roomCode}
    />
  )
}

export default Toggle;
