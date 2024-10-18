import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "../styles/navBar.css";


 
const NavBar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole");

  // Determine the navigation path based on the role
  const goToHome = () => {
    if (role === "Hotel") {
      navigate("/Hotel/dashboard", { replace: true });
    } else if (role === "Laundry") {
      navigate("/Laundry/dashboard", { replace: true });
    } else if (role === "Delivery") {
      navigate("/Delivery/dashboard", { replace: true });
    } else {
      navigate("/home", { replace: true }); 
    }
  };
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="Logo" className="app-logo" />

        <div className="nav-links">
          <p className="nav-home" onClick={goToHome}>
            Home
          </p>
          <p className="nav-settings" onClick={goToHome}>
            Settings
          </p>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
