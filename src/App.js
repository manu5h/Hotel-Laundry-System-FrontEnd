import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StartPage from './pages/StartPage';
import Login from './pages/Login';
import ResetPassword from './pages/ResetPassword';
import ResetPassword_OTP from './pages/ResetPassword_OTP.js';
import LoginDelivery from './pages/LoginDelivery';
import LoginDelivery_OTP from './pages/LoginDelivery_OTP';
import RegisterHotel from './pages/RegisterHotel';
import RegisterLaundry from './pages/RegisterLaundry';
import RegisterHotel_OTP from './pages/RegisterHotel_OTP';
import RegisterLaundry_OTP from './pages/RegisterLaundry_OTP';
import HotelDashboard from './pages/DashboardHotel';
import ProtectedRoute from './components/ProtectedRoute';
import Settings from './pages/Settings';
import AddtoBasket from './pages/AddtoBasket.js';
import CreateOrder from './pages/CreateOrder.js';
import RequestLaundry from './pages/RequestOrder.js';
import RequestOrderConfirm from './pages/RequestOrderConfirm.js';
import LaundryDashboard from './pages/DashboardLaundry.js';
import AcceptByLaundry from './pages/AcceptByLaundry.js';
import PendingPayment from './pages/PendingPayments.js';
import AddPickupRider from './pages/AddPickupRider.js';
import RegisterRider from './pages/RegisterRider.js';
import RegisterRider_OTP from './pages/RegisterRider_OTP';
import RiderDashboard from './pages/DashboardRider.js';
import PickupfromHotel from './pages/PickupFromHotel.js';
import DroptoLaundry from './pages/DroptoLaundry.js';
import PickupfromLaundry from './pages/PickupfromLaundry.js';
import DroptoHotel from './pages/DroptoHotel.js';
import AddDropRider from './pages/AddDropRider.js';
import History_hotel from './pages/History_Hotel.js';


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
            <Route path="/resetPassword/:role" element={<ResetPassword />} />
            <Route path="/resetPassword/:role/page2" element={<ResetPassword_OTP />} />
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
          <Route path="/hotel/dashboard" element={<HotelDashboard />} />
          <Route path="/laundry/dashboard" element={<LaundryDashboard />} />
          <Route path="/delivery/dashboard" element={<RiderDashboard />} />
          <Route path="/:role/Settings" element={<Settings />} />
          <Route path="/addtoBasket" element={<AddtoBasket />} />
          <Route path="/CreateOrder" element={<CreateOrder />} />
          <Route path="/RequestLaundry" element={<RequestLaundry />} />
          <Route path="/RequestOrder/Page2" element={<RequestOrderConfirm />} />
          <Route path="/AcceptOrders" element={<AcceptByLaundry />} />
          <Route path="/PendingPayment" element={<PendingPayment />} />
          <Route path="/confirmPayment" element={<AddPickupRider />} />
          <Route path="/RegisterRider" element={<RegisterRider />} />
          <Route path="/RegisterRider/page2" element={<RegisterRider_OTP />} />
          <Route path="/PickupfromHotel" element={<PickupfromHotel />} />
          <Route path="/DroptoLaundry" element={<DroptoLaundry />} />
          <Route path="/PickupfromLaundry" element={<PickupfromLaundry />} />
          <Route path="/DroptoHotel" element={<DroptoHotel />} />
          <Route path="/AddDropRider" element={<AddDropRider />} />
          <Route path="/HotelHistory" element={<History_hotel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
