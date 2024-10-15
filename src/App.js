import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import LoginDelivery from './pages/LoginDelivery';
import LoginDelivery_OTP from './pages/LoginDelivery_OTP';
import RegisterHotel from './pages/RegisterHotel';
import RegisterLaundry from './pages/RegisterLaundry';
import RegisterHotel_OTP from './pages/RegisterHotel_OTP';
import RegisterLaundry_OTP from './pages/RegisterLaundry_OTP';
import HotelDashboard from './pages/DashboardHotel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Function to get user role from localStorage
  const getUserRole = () => {
    return localStorage.getItem("userRole"); // Adjust this if you have a different key for role
  };

  // Redirect to dashboard if token exists
  const token = localStorage.getItem("token");
  const role = getUserRole();

  return (
    <Router>
      <Routes>
        {token ? (
          <Route path="/" element={<Navigate to={`/${role}/dashboard`} replace />} />
        ) : (
          <>
            {/* Public Routes */}
            <Route path="/" element={<StartPage />} />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/login/Delivery" element={<LoginDelivery />} />
            <Route path="/login/Delivery/page2" element={<LoginDelivery_OTP />} />
            <Route path="/register/Hotel" element={<RegisterHotel />} />
            <Route path="/register/Laundry" element={<RegisterLaundry />} />
            <Route path="/register/hotel/page2" element={<RegisterHotel_OTP />} />
            <Route path="/register/laundry/page2" element={<RegisterLaundry_OTP />} />
          </>
        )}

        {/* Protected Route for HotelDashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/:role/dashboard" element={<HotelDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
