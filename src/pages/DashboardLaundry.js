import React, { useEffect, useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import "../styles/Laundry_Dashboard.css";
import { API_ENDPOINT } from "../config";
import logo from "../assets/images/logo.png";
import box1 from "../assets/images/Accept_order_btn.png";
import box2 from "../assets/images/AddPickupRider_btn.png";
import box3 from "../assets/images/OngoingOrders_btn.png";
import box4 from "../assets/images/addDropRider_btn.png";
import box5 from "../assets/images/History_laundry_btn.png";
import box6 from "../assets/images/createRider_btn.png";

const LaundryDashboard = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  const [LaundryDetails, setLaundryDetails] = useState(null); // To store Laundry details
  const [error, setError] = useState(""); // To store any errors

  useEffect(() => {
    const fetchLaundryDetails = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const LaundryId = localStorage.getItem("userID");

        // Check if token is not present
        if (!storedToken) {
          navigate("/login/Laundry", { replace: true });
          return;
        }

        // Make the API call to get Laundry details
        const response = await fetch(
          API_ENDPOINT.GET_Laundry_details.replace(":laundry_id", LaundryId),
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
          setLaundryDetails(result); // Store Laundry details
          setError(""); // Clear errors
        } else if (response.status === 403 || response.status === 401) {
          // If the token is invalid or expired, redirect to login
          console.error("Token is invalid or expired.");
          localStorage.removeItem("token"); // Optionally clear the token
          navigate("/login/Laundry", { replace: true });
        } else {
          const errorResult = await response.json();
          setError(errorResult.error || "Failed to fetch Laundry details.");
        }
      } catch (error) {
        console.error("Error fetching Laundry details:", error);
        setError("An error occurred while fetching Laundry details.");
        navigate("/login/laundry", { replace: true }); // Redirect to login if an error occurs
      }
    };

    fetchLaundryDetails();
  }, [navigate]);

  return (
    <div className="laundry-dashboard">
      <div className="dashboard-logo">
        <img src={logo} alt="Logo"/>
        <button onClick={() => navigate(`/${role}/Settings`)}>Settings</button>
      </div>
      <div className="laundry-dashboard-icons-secondRow">
      <Link to="/AcceptOrders">
          <img src={box1} alt="Add-to-basket" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/confirmPayment">
          <img src={box2} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/dashboard">
          <img src={box3} alt="Add-to-basket" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      <div className="laundry-dashboard-icons-secondRow">
        
        <Link to="/dashboard">
          <img src={box4} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/dashboard">
          <img src={box5} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
        <Link to="/RegisterRider">
          <img src={box6} alt="Create-order" style={{ cursor: "pointer" }} />
        </Link>
      </div>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default LaundryDashboard;
