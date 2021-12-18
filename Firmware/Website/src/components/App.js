import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './CSS/App.css';
import DashboardPage from './DashboardPage';
import Homepage from './Homepage.js'
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage'
import DevicePage from './DevicePage';
import DashboardSerial from './DashboardSerial';

function App() {
  return (
    <Router>
        <Routes>
          <Route exact path="/" element={<Homepage/>}/>
          <Route exact path="/login" element={<LoginPage/>}/>
          <Route exact path="/register" element={<RegisterPage/>}/>
          {/* <Route exact path="/dashboard" element={<DashboardPage/>}/> */}
          <Route exact path="/dashboard" element={<DashboardSerial/>}/>
          <Route exact path="/deviceRegister" element={<DevicePage/>}/>
          {/* <Route path="*" element={<NotFound/>}/> */}
        </Routes>
    </Router>
  );
}

export default App;
