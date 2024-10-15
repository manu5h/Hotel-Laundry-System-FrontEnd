import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import SwitchContainer from "../components/SwitchContainer";
import "../styles/Hotel_Dashboard.css";
import BasketButton from "../assets/images/AddToBasket.png";
import OrderButton from "../assets/images/CreateOrder.png";
import { API_ENDPOINT } from "../config";

const HotelDashboard = () => {
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState(null); // To store hotel details
  const [error, setError] = useState(""); // To store any errors

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const hotelId = localStorage.getItem("userID");

        console.log("hotelid "+hotelId);
        console.log("token "+storedToken);
        console.log("local "+localStorage);

        // If no token is found, redirect to the login page
        if (!storedToken) {
          navigate("/login/Hotel", { replace: true });
          return;
        }

        // Make the API call to get hotel details
        const response = await fetch(
          API_ENDPOINT.GET_Hotel_details.replace(":hotel_id", hotelId),
          {
            method: "GET", // Use GET method for fetching details
            headers: {
              Authorization: `Bearer ${storedToken}`, // Pass the token in headers if needed
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setHotelDetails(result); // Store the hotel details in state
          setError(""); // Clear any previous errors
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Failed to fetch hotel details");
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError("An error occurred while fetching hotel details.");
      }
    };

    fetchHotelDetails(); // Call the function to fetch details on component load
  }, [navigate]);

  return (
    <div className="hotel-dashboard">
      <Navbar role="Hotel" />
      {error && <p className="error">{error}</p>}
      {hotelDetails ? (
        <div>
          <h3>
            {hotelDetails.hotel.hotel_name} - {hotelDetails.hotel.nearest_city}
          </h3>
          <div className="main-buttons">
            <img
              className="Basket-btn"
              src={BasketButton}
              alt="Add to Basket"
              onClick={() => navigate(`/login/`)}
            />
            <img
              className="Order-btn"
              src={OrderButton}
              alt="Create Order"
              onClick={() => navigate(`/login/`)}
            />
          </div>
          <SwitchContainer/>
        </div>
      ) : (
        <p>Loading hotel details...</p>
      )}
    </div>
  );
};

export default HotelDashboard;
