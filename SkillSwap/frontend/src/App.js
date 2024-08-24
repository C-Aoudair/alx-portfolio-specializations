import React from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Messages from './components/Messages';
import SearchResults from './components/SearchResults';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/profile" replace />} /> */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
