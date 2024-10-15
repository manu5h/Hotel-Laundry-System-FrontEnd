// src/components/ProtectedRoute.js

import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  // Check if a token exists in localStorage (user is logged in)
  const token = localStorage.getItem("token");

  // If no token, redirect to the login page
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
