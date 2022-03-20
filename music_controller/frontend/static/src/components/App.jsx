import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import JoinRoomPage from './JoinRoomPage.jsx';
import CreateRoomPage from './CreateRoomPage.jsx';
import Toggle from './Toggle.jsx';

function App() {
  const [guestCanPause, setGuestCanPause ] = useState(true);
  const [votesToSkip, setVotesToSkip] = useState(2);
  const [roomCode, setRoomCode] = useState(null);

  useEffect(() => {
    fetch('/api/user-in-room')
        .then((response) => response.json())
        .then(({ code }) => {
          console.log('effect code', code) // DELETE ME ------------------------
          setRoomCode(code);
        });
  }, []);

  return (
    <Router>
      <Routes>
      <Route exact path="/" element={ roomCode ? (<Navigate to={`/room/${roomCode}`} />) : <HomePage />} />
        <Route path='/join' element={<JoinRoomPage />} />
        <Route path='/create' element={<CreateRoomPage
          update={false}
          votesToSkip={votesToSkip}
          setVotesToSkip={setVotesToSkip}
          guestCanPause={guestCanPause}
          setGuestCanPause={setGuestCanPause}
          />}
        />
        <Route path='/room/:roomCode' element={<Toggle setRoomCallback={setRoomCode} />} />
      </Routes>
    </Router>
  );
}

export default App;