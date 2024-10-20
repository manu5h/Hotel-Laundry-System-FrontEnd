import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

const RequestOrderConfirm = () => {
  const location = useLocation();
  const hotelId = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const { laundryId } = location.state || {};

  const [orders, setOrders] = useState([]);
  const [laundry_id, setLaundryID] = useState("");
  const [laundry_email, setLaundryEmail] = useState("");
  const [laundry_name, setLaundryName] = useState("");
  const [laundry_phone_number, setLaundryPhoneNumber] = useState("");
  const [laundry_address, setLaundryAddress] = useState("");
  const [laundry_nearest_city, setLaundryNearestCity] = useState("");

  // State to manage item details visibility
  const [visibleItemDetails, setVisibleItemDetails] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch laundry details using laundryId
    fetch(API_ENDPOINT.GET_Laundry_details.replace(":laundry_id", laundryId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const laundry = data.laundry;
        setLaundryEmail(laundry.email);
        setLaundryName(laundry.laundry_name);
        setLaundryPhoneNumber(laundry.phone_number);
        setLaundryAddress(laundry.address);
        setLaundryNearestCity(laundry.nearest_city);
        setLaundryID(laundry.id);
      })
      .catch((error) => {
        console.error("Error fetching laundry details:", error);
      });
  }, [laundryId]);

  useEffect(() => {
    fetch(API_ENDPOINT.GET_Orders_By_Hotel_Id.replace(":hotel_id", hotelId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        const unassignedOrders = data.orders.filter(
          (order) => order.laundry_id === null
        );
        setOrders(unassignedOrders);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [hotelId]);

  const handleRequestLaundry = (orderId) => {
    console.log("Order ID:", orderId);
    console.log("Hotel ID:", hotelId);
    console.log("Laundry ID:", laundry_id);

    // Confirmation dialog
    const confirmRequest = window.confirm(
      `Are you sure you want to send a request for order ID ${orderId} from this laundry?`
    );

    if (!confirmRequest) {
      return; // Exit the function if the user clicks "Cancel"
    }

    fetch(API_ENDPOINT.REQUEST_Laundry.replace(":hotel_id", hotelId), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storedToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId: orderId,
        laundry_id: laundry_id,
      }),
    })
      .then((response) => {
        // Check for non-200 status codes
        if (!response.ok) {
          return response.json().then((errorData) => {
            // Log the error data
            console.error("Error response data:", errorData);
            throw new Error(errorData.message || "Failed to request laundry");
          });
        }
        alert("Laundry requested successfully!");
        navigate("/");
      })
      .catch((error) => {
        console.error("Error requesting laundry:", error);
        alert(error.message); // Show the error message to the user
      });
  };

  const toggleItemDetails = (orderId) => {
    setVisibleItemDetails((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  return (
    <div className="request-order-confirm-bg">
      <NavBar />
      <div className="request-order-main-container">
        <div className="laundry-details-view">
          <h2>Laundry Details</h2>
          <p>Name: {laundry_name}</p>
          <p>Email: {laundry_email}</p>
          <p>Phone number: {laundry_phone_number}</p>
          <p>Address: {laundry_address}</p>
          <p>Nearest city: {laundry_nearest_city}</p>
        </div>
        <div className="request-order-confirm-container">
          <h2>Select Order to Request Laundry</h2>

          {orders.length > 0 ? (
            <table className="request-order-confirm-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Created Time</th>
                  <th>Weight</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <React.Fragment key={order.id}>
                    <tr>
                      <td>{order.id}</td>
                      <td>{new Date(order.created_time).toLocaleString()}</td>
                      <td>{order.weight ? order.weight : "N/A"}</td>

                      <td>
                        <button
                          className="more-info-btn"
                          onClick={() => toggleItemDetails(order.id)}
                          title="More Info"
                        >
                          <FontAwesomeIcon icon={faInfoCircle} />
                        </button>
                        <button
                          className="Request-Laundry-btn"
                          onClick={() => handleRequestLaundry(order.id)}
                        >
                          Request
                        </button>
                      </td>
                      <td></td>
                    </tr>
                    {visibleItemDetails[order.id] && (
                      <tr>
                        <td colSpan="5">
                          <div className="item-details">
                            <h4>Items of the order</h4>
                            <table>
                              <thead>
                                <tr>
                                  <th>Category</th>
                                  <th>Cleaning Type</th>
                                  <th>Pressing/Ironing</th>
                                  <th>Stain Removal</th>
                                  <th>Folding</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.clothingItems.map((item) => (
                                  <tr key={item.id}>
                                    <td>{item.category}</td>
                                    <td>{item.cleaningType}</td>
                                    <td>
                                      {item.pressing_ironing ? "Yes" : "No"}
                                    </td>
                                    <td>{item.stain_removal ? "Yes" : "No"}</td>
                                    <td>{item.folding ? "Yes" : "No"}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No unassigned orders available!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestOrderConfirm;
