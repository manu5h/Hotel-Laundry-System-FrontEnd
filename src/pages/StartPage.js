import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StartPage.css";
import logo from "../assets/images/logo.png";

const StartPage = () => {
  const navigate = useNavigate();

  const handleNavigation = (role) => {
    navigate(`/login/${role}`);
  };

  return (
    <div className="Main-container">
      <div className="starting-page-logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="slogan">
        <h1>
          Efficient laundry connection?<br></br>
          We’ve got you.
        </h1>
        <p>Seamless service, delivered to your hotel.</p>
      </div>
      <div className="start-page">
        <p className="continue-text">Continue as a</p>
        <div className="options">
          <button onClick={() => handleNavigation("Hotel")}>Hotel</button>
          <button onClick={() => handleNavigation("Laundry")}>Laundry</button>
          <button onClick={() => handleNavigation("Delivery")}>Delivery</button>
        </div>
      </div>
    </div>
  );
};

export default StartPage;
