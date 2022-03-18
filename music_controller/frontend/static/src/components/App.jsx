import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, Redirect } from 'react-router-dom'
import HomePage from './HomePage.jsx'
import JoinRoomPage from './JoinRoomPage.jsx'
import CreateRoomPage from './CreateRoomPage.jsx'


class App extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Router>
        <Routes>
        <Route exact path="/" element={<HomePage />} />
          <Route path='/join' element={<JoinRoomPage />} />
          <Route path='/create' element={<CreateRoomPage />} />
        </Routes>
      </Router>
    )
  }

}

export default App;