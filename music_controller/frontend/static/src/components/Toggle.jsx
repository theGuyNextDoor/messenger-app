import React, { useState, useEffect } from 'react'
import { Grid, Button, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import Room from './Room.jsx'
import Settings from './Settings.jsx'


function Toggle({ setRoomCallback }) {
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [guestCanPause, setGuestCanPause] = useState(false);
  const [isHost, setIsHost] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [spotifyAuthenticated, setSpotifyAuthenticated] = useState(false);
  const { roomCode } = useParams();
  const navigate = useNavigate({});

  useEffect(() => {
    fetch(`/api/get-room?code=${roomCode}`)
      .then((response) => {
        if (!response.ok) {
          setRoomCallback(null);
          const path = '/';
          navigate(path);
        }
        return response.json();
      })
      .then((data) => {
        if (data.votes_to_skip) {
          console.log(data) // DELETE ME ---------------------------------------
          setVotesToSkip(data.votes_to_skip);
          setGuestCanPause(data.guest_can_pause);
          setIsHost(data.is_host);
          if (data.is_host) {
            authticateSpotify();
          }
        }
      })
  }, [])

  function authticateSpotify() {
    fetch('/spotify/is-authenticated')
      .then((response) => response.json())
      .then(({ status }) => {
        setSpotifyAuthenticated(status)
        console.log('is the host authorized?', status); // DELETE ME ---------------
        if (!status) {
          fetch('/spotify/get-auth-url')
            .then((response) => response.json())
            .then((data) =>{
              window.location.replace(data.url) // redirects to spotify auth page
            })
        }
      });
  }

  const updateShowSettings = () => {
    setShowSettings(!showSettings);
  }
  if (showSettings) {
    return (
      <Settings
        updateShowSettings={updateShowSettings}
        // votesToSkip={votesToSkip}
        setVotesToSkip={setVotesToSkip}
        guestCanPause={guestCanPause}
        setGuestCanPause={setGuestCanPause}
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
