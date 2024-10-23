import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/RiderProcess.css";
import BG_img from "../assets/images/pickupfromlaundry_bg.png";

const PickupfromLaundry = () => {
  const riderID = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          API_ENDPOINT.GET_Orders_By_Rider_Id.replace(":rider_id", riderID),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchLaundries = async () => {
      try {
        const response = await fetch(API_ENDPOINT.GET_All_Laundries, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to fetch laundries");
        }

        const data = await response.json();
      } catch (error) {
        console.error("Error fetching laundries:", error);
        setError("Failed to fetch laundries.");
      }
    };

    fetchOrders();
    fetchLaundries();
  }, [riderID, storedToken]);

  // Function to handle accepting the order
  const handleAccept = async (orderId) => {
    const confirmed = window.confirm(
      "Please confirm that you are ready to pick up this order from the laundry."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/order/${orderId}/laundryPickup`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to accept order");
      }
      window.location.reload(); // Reload the page after successful request
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order.");
    }
  };

  // Function to handle info icon click
  const handleInfoClick = async (order) => {
    setSelectedOrder(order);
    try {
      const response = await fetch(
        API_ENDPOINT.GET_Laundry_details.replace(
          ":laundry_id",
          order.laundry_id
        ),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const data = await response.json();
      } else {
        setError("Failed to fetch laundry details.");
      }
    } catch (error) {
      console.error("Error fetching laundry details:", error);
      setError("Failed to fetch laundry details.");
    }
  };

  const validOrders = orders.filter((order) => order.orderStatus === 6);

  return (
    <div
      className="rider-process-main-container"
      style={{
        backgroundImage: `url(${BG_img})`,
        backgroundSize: "cover",
        minHeight: "110vh",
      }}
    >
      <NavBar />
      <div className="rider-process-details">
        <h2 style={{ marginBottom: "0" }}>Pickup From Laundry</h2>
        {error && <p className="error-message">{error}</p>}

        {validOrders.length === 0 ? (
          <p style={{  fontWeight: "bold" }}>
            No orders available for pickup.
          </p>
        ) : (
          <table className="rider-process-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Hotel Name</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No pending orders.
                  </td>
                </tr>
              ) : (
                orders
                  .filter((order) => validOrders)
                  .map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.hotel.name}</td>
                      <td style={{ position: "relative" }}>
                        <div
                          className="arrow-container"
                          onClick={() => handleInfoClick(order)}
                        >
                          <FontAwesomeIcon icon={faArrowRight} size="2xl" />
                        </div>
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        )}

        {selectedOrder && (
          <div className="order-details-modal">
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id || "Not set"}
            </p>
            <h4>Clothing Items:</h4>
            <ul>
              {selectedOrder.clothingItems.map((item) => {
                let itemDetails = `${item.category}, ${item.cleaningType}`;
                if (item.pressing_ironing === 1)
                  itemDetails += " , Pressing/Ironing";
                if (item.stain_removal === 1) itemDetails += " , Stain Removal";
                if (item.folding === 1) itemDetails += " , Folding";
                if (item.special_instructions)
                  itemDetails += ` , Special Instructions: ${item.special_instructions}`;
                return <li key={item.id}>{itemDetails}</li>;
              })}
            </ul>

            <p>
              <strong>Weight:</strong> {selectedOrder.weight || "Not set"}
            </p>
            <p>
              <strong>Special Notes:</strong>{" "}
              {selectedOrder.special_notes || "None"}
            </p>

            <h3>Hotel Details:</h3>
            <p>
              <strong>Name:</strong> {selectedOrder.hotel.name}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.hotel.address}
            </p>
            <p>
              <strong>Nearest City:</strong> {selectedOrder.hotel.nearest_city}
            </p>
            <p>
              <strong>Phone Number:</strong> {selectedOrder.hotel.phone_number}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.hotel.email}
            </p>

            <div className="order-action-buttons">
              <button
                className="accept-button"
                onClick={() => handleAccept(selectedOrder.id)}
              >
                Confirm Pickup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PickupfromLaundry;
