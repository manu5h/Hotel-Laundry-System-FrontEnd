import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../styles/Rider_Dashboard.css";
import { API_ENDPOINT } from "../config";
import logo from "../assets/images/logo.png";
import box1 from "../assets/images/Accept_order_btn.png";
import box2 from "../assets/images/AddPickupRider_btn.png";
import box3 from "../assets/images/OngoingOrders_btn.png";
import box4 from "../assets/images/addDropRider_btn.png";
import box5 from "../assets/images/History_laundry_btn.png";
import box6 from "../assets/images/createRider_btn.png";

const RiderDashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [RiderDetails, setRiderDetails] = useState(null); // To store Laundry details
  const [error, setError] = useState(""); // To store any errors

  useEffect(() => {
    const fetchRiderDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const RiderId = localStorage.getItem("userID");

        // Check if token is not present
        if (!storedToken) {
          navigate("/login/Delivery", { replace: true });
          return;
        }

        // Make the API call to get Rider details
        const response = await fetch(
          API_ENDPOINT.GET_Delivery_details.replace(":rider_id", RiderId),
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
          setRiderDetails(result); // Store Rider details
          setError(""); // Clear errors
        } else if (response.status === 403 || response.status === 401) {
          // If the token is invalid or expired, redirect to login
          console.error("Token is invalid or expired.");
          localStorage.removeItem("token"); // Optionally clear the token
          navigate("/login/Delivery", { replace: true });
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Failed to fetch Rider details.");
        }
      } catch (error) {
        console.error("Error fetching Rider details:", error);
        setError("An error occurred while fetching Rider details.");
        navigate("/login/Delivery", { replace: true }); 
      }
    };

    fetchRiderDetails();
  }, [navigate]);

  return (
    <div className="Rider-dashboard">
      <div className="dashboard-logo">
        <img src={logo} alt="Logo"/>
        <button onClick={() => navigate(`/${role}/Settings`)}>Settings</button>
      </div>
      <div className="Rider-dashboard-icons-secondRow">
      <Link to="/AcceptOrders">
          <img src={box1} alt="Add-to-basket" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/confirmPayment">
          <img src={box2} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      <div className="Rider-dashboard-icons-secondRow">
        
        <Link to="/dashboard">
          <img src={box4} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/dashboard">
          <img src={box5} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RiderDashboard;
