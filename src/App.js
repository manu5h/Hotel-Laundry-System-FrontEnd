import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from './pages/StartPage'; 
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ResetPassword_OTP from './pages/ResetPassword_OTP';
import LoginDelivery from './pages/LoginDelivery';
import LoginDelivery_OTP from './pages/LoginDelivery_OTP';
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
        <Route path="/resetPassword/:role" element={<ResetPassword />} />
        <Route path="/resetPassword/:role/page2" element={<ResetPassword_OTP />} />
        <Route path="/login/Delivery" element={<LoginDelivery />} />
        <Route path="/login/Delivery/page2" element={<LoginDelivery_OTP />} />
        <Route path="/register/Hotel" element={<RegisterHotel />} />
        <Route path="/register/Laundry" element={<RegisterLaundry />} />
        <Route path="/register/hotel/page2" element={<RegisterHotel_OTP />} />
        <Route path="/register/laundry/page2" element={<RegisterLaundry_OTP />} />
      </Routes>
    </Router>
  );
}

export default App;
