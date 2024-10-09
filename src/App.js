import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage'; 
import Login from './pages/Login'; // Placeholder for login page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login/:role" element={<Login />} /> {/* Dynamic login based on role */}
      </Routes>
    </Router>
  );
}

export default App;
