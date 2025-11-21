// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CheckUser from './components/auth/CheckUser';
import Login from './components/auth/Login';
import GuestMenu from './components/auth/GuestMenu';
import MainMenu from './components/MainMenu';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CheckUser />} />
        <Route path="/login" element={<Login />} />
        <Route path="/guest-menu" element={<GuestMenu />} />
        <Route path="/main-menu" element={<MainMenu />} />
      </Routes>
    </Router>
  );
}

export default App;