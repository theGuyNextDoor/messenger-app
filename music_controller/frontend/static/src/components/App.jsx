import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom';
import HomePage from './HomePage.jsx';
import JoinRoomPage from './JoinRoomPage.jsx';
import CreateRoomPage from './CreateRoomPage.jsx';
import Room from './Room.jsx';

function App() {
  return (
    <Router>
      <Routes>
      <Route exact path="/" element={<HomePage />} />
        <Route path='/join' element={<JoinRoomPage />} />
        <Route path='/create' element={<CreateRoomPage />} />
        <Route path='/room/:roomCode' element={<Room />} />
      </Routes>
    </Router>
  );
}

export default App;