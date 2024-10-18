import React, { useState, useEffect } from 'react';
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
import Settings from './pages/Settings';

function App() {
  // State to hold the token
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  // Function to get user role from localStorage
  const getUserRole = () => {
    return localStorage.getItem("userRole"); // Adjust this if you have a different key for role
  };
  
  const role = getUserRole();

  // Effect to listen for token changes and re-render component
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up event listener on unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <Routes>
        {/* Conditional Rendering based on token existence */}
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

        {/* Protected Routes for Authenticated Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/:role/dashboard" element={<HotelDashboard />} />
          <Route path="/:role/Settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
