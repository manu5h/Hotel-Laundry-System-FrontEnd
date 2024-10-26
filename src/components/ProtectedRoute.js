import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Function to check if the token is valid
  const isTokenValid = (token) => {
    if (!token) return false;

    try {
      const { exp } = jwtDecode(token);
      if (!exp) return false;

      const isExpired = Date.now() >= exp * 1000; // Convert to milliseconds
      return !isExpired;
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  };

  // Redirect to login if token is invalid
  if (!isTokenValid(token)) {
    // Check if the alert has already been shown
    if (!localStorage.getItem("sessionExpiredAlertShown")) {
      alert("Session expired! Log in back!");
      localStorage.setItem("sessionExpiredAlertShown", "true"); // Set flag to avoid repeated alerts
    }

    // Clear storage and navigate to login page
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userID");
    sessionStorage.clear();

    // Optional: Use a setTimeout to allow the alert to show before navigation
    setTimeout(() => {
      window.location.reload(); // This will force the page to reload after showing the alert
    }, 100);

    return <Navigate to="/" replace />;
  }

  // If token is valid, allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;
