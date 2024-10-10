import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage'; 
import Login from './pages/Login';
import RegisterHotel from './pages/RegisterHotel';
import RegisterLaundry from './pages/RegisterLaundry';
import RegisterHotel_OTP from './pages/RegisterHotel_OTP';
import RegisterLaundry_OTP from './pages/RegisterLaundry_OTP';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/login/:role" element={<Login />} />
        <Route path="/register/Hotel" element={<RegisterHotel />} />
        <Route path="/register/Laundry" element={<RegisterLaundry />} />
        <Route path="/register/hotel/page2" element={<RegisterHotel_OTP />} />
        <Route path="/register/laundry/page2" element={<RegisterLaundry_OTP />} />
      </Routes>
    </Router>
  );
}

export default App;
