import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CheckUser from './components/auth/CheckUser';
import Login from './components/auth/Login';
import GuestMenu from './components/auth/GuestMenu';
import MainMenu from './components/MainMenu';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<CheckUser />} />
          <Route path="/login" element={<Login />} />
          <Route path="/guest-menu" element={<GuestMenu />} />
          <Route path="/main-menu" element={<MainMenu />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;