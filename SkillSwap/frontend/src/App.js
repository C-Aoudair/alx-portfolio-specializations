import React, { useState, useEffect } from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Chat from "./components/Chat";
import SearchResults from "./components/SearchResults";
import Login from "./components/Login";
import Signup from "./components/Signup";
import io from "socket.io-client";

function AppContent() {
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (user) {
      setSocket(
        io("http://localhost:4000", {
          query: {
            userId: user.id,
          },
        })
      );
    }
  }, [user]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {location.pathname !== "/login" && location.pathname !== "/signup" && (
        <Navbar />
      )}
      <div style={{ padding: 20 }}>
        <Routes>
          <Route path="/profile" element={user && <Profile user={user} />} />
          <Route
            path="/chat"
            element={socket && <Chat me={user} socket={socket} />}
          />
          <Route path="/search" element={<SearchResults user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/signup" element={<Signup setUser={setUser} />} />
          <Route path="/" element={<Login setUser={setUser} />} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
