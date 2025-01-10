import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';// Import jwt-decode to decode the token
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';

const App = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route
          path="/login"
          element={
            <LoginPage
              setToken={(t) => {
                setToken(t);
                const decoded = jwtDecode(t); // Decode the token
                setUserId(decoded.id); // Extract userId from the token
              }}
            />
          }
        />
        <Route
          path="/chat"
          element={token ? <ChatPage token={token} userId={userId} /> : <Navigate to="/login" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
