import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../styles/Hotel_Dashboard.css";
import { API_ENDPOINT } from "../config";
import logo from "../assets/images/logo.png";
import AddToBasket from "../assets/images/AddToBasket.png";
import box1 from "../assets/images/requestLaundry_btn.png";
import box2 from "../assets/images/PendingPayments_btn.png";
import box3 from "../assets/images/OngoingOrders_btn.png";
import box4 from "../assets/images/History_laundry_btn.png";
import CreateOrder from "../assets/images/CreateOrder.png";

const HotelDashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [hotelDetails, setHotelDetails] = useState(null); // To store hotel details
  const [error, setError] = useState(""); // To store any errors

  useEffect(() => {
    const fetchHotelDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const hotelId = localStorage.getItem("userID");

        // Check if token is not present
        if (!storedToken) {
          navigate("/login/Hotel", { replace: true });
          return;
        }

        // Make the API call to get hotel details
        const response = await fetch(
          API_ENDPOINT.GET_Hotel_details.replace(":hotel_id", hotelId),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Handle response based on status code
        if (response.ok) {
          const result = await response.json();
          setHotelDetails(result); // Store hotel details
          setError(""); // Clear errors
        } else if (response.status === 403 || response.status === 401) {
          // If the token is invalid or expired, redirect to login
          console.error("Token is invalid or expired.");
          localStorage.removeItem("token"); // Optionally clear the token
          navigate("/login/Hotel", { replace: true });
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Failed to fetch hotel details.");
        }
      } catch (error) {
        console.error("Error fetching hotel details:", error);
        setError("An error occurred while fetching hotel details.");
        navigate("/login/Hotel", { replace: true }); // Redirect to login if an error occurs
      }
    };

    fetchHotelDetails();
  }, [navigate]);

  return (
    <div className="hotel-dashboard">
      <div className="dashboard-logo">
        <img src={logo} alt="Logo"/>
        <button onClick={() => navigate(`/${role}/Settings`)}>Settings</button>
      </div>
      <div className="dashboard-icons-firstRow">
        <Link to="/addtoBasket">
          <img src={AddToBasket} alt="Add-to-basket" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/CreateOrder">
          <img src={CreateOrder} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      <div className="dashboard-icons-secondRow">
        <Link to="/RequestLaundry">
          <img src={box1} alt="Add-to-basket" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/PendingPayment">
          <img src={box2} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/OnGoingOrders">
          <img src={box3} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/HotelHistory">
          <img src={box4} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default HotelDashboard;
