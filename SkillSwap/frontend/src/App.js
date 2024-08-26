import React from 'react';
import { useState } from 'react';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Chat from './components/Chat';
import SearchResults from './components/SearchResults';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [user, setUser] = useState(null);
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/profile" element={user && <Profile user={user} />} />
          <Route path="/chat" element={<Chat me={user} />} />
          <Route path="/search" element={<SearchResults user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
      </div>
    </Router>
  );
}

export default App;
