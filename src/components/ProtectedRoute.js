// src/components/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if a token exists in localStorage (user is logged in)
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired! Log in back!"); // Show the alert before redirecting
    return <Navigate to="/" replace />; // Redirect to login
  }

  // If token exists, allow access to the route
  return <Outlet />;
};

export default ProtectedRoute;
