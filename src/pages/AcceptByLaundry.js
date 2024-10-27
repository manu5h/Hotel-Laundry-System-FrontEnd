import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import "../styles/AcceptbyLaundry.css";
import { API_ENDPOINT } from "../config";

const AcceptByLaundry = () => {
  const laundryId = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [amount, setAmount] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          API_ENDPOINT.GET_Orders_By_Laundry_Id.replace(
            ":laundry_id",
            laundryId
          ),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders || []); // Assuming data.orders is the correct path
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [laundryId, storedToken]);

  const handleInfoClick = (order) => {
    setSelectedOrder(order);
    setAmount(""); // Reset amount when a new order is selected
    setSelectedOrderId(order.id); // Set selected order ID
  };

  const handleConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this order?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        API_ENDPOINT.CONFIRM_order_laundry.replace(
          ":laundry_id",
          laundryId
        ).replace(":order_id", selectedOrder.id),
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ price: parseFloat(amount) }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm order");
      }

      window.location.reload();
      setSelectedOrder(null);
      setAmount(""); // Reset amount after confirming
    } catch (error) {
      console.error("Error confirming order:", error);
      setError("Failed to confirm order.");
    }
  };

  const handleDecline = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this order?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        API_ENDPOINT.DECLINE_order_laundry.replace(
          ":laundry_id",
          laundryId
        ).replace(":order_id", selectedOrder.id),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to decline order");
      }

      // Optionally refresh orders or handle the UI accordingly
      setSelectedOrder(null);
      window.location.reload();
    } catch (error) {
      console.error("Error declining order:", error);
      setError("Failed to decline order.");
    }
  };

  // Function to validate amount
  const isValidAmount = (value) => {
    const amountValue = parseInt(value);
    return !isNaN(amountValue) && amountValue >= 150; // Minimum amount is 150 LKR
  };

  return (
    <div className="accept-by-laundry-main-container">
      <NavBar />
      <div className="accept-by-laundry">
        <h2>Pending Orders</h2>
        {error && <p className="error-message">{error}</p>}

        {orders.length === 0 ? (
          <p>No orders available.</p>
        ) : (
          <table className="accept-by-laundry-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Hotel Name</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .filter((order) => order.orderStatus === 1)
                .map((order) => (
                  <tr
                    key={order.id}
                    style={{
                      backgroundColor:
                        selectedOrderId === order.id ? "#758694" : "#025a97",
                    }}
                  >
                    <td>{order.id}</td>
                    <td>{order.hotel_details.hotel_name || "N/A"}</td>
                    <td>
                      {order.created_time
                        ? `${order.created_time.slice(0, 10)}`
                        : "N/A"}
                    </td>
                    <td style={{ position: "relative" }}>
                      <div
                        className="arrow-container"
                        onClick={() => handleInfoClick(order)}
                      >
                        <FontAwesomeIcon icon={faArrowRight} size="2xl" />
                      </div>
                    </td>
                  </tr>
                ))}
              {orders.filter((order) => order.orderStatus === 1).length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No pending orders available.
                  </td>
                </tr>
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
                if (item.pressing_ironing === 1) {
                  itemDetails += " , Pressing/Ironing";
                }
                if (item.stain_removal === 1) {
                  itemDetails += " , Stain Removal";
                }
                if (item.folding === 1) {
                  itemDetails += " , Folding";
                }
                if (item.special_instructions) {
                  itemDetails += ` , Special Instructions: ${item.special_instructions}`;
                }
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

            <h3>Hotel Details</h3>
            <p>
              <strong>Hotel Name:</strong>{" "}
              {selectedOrder.hotel_details.hotel_name}
            </p>
            <p>
              <strong>Address:</strong>{" "}
              {selectedOrder.hotel_details.address || "N/A"}
            </p>
            <p>
              <strong>Nearest City:</strong>{" "}
              {selectedOrder.hotel_details.nearest_city || "N/A"}
            </p>
            <p>
              <strong>Phone Number:</strong>{" "}
              {selectedOrder.hotel_details.phone_number || "N/A"}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {selectedOrder.hotel_details.email || "N/A"}
            </p>

            {/* Input field for amount */}
            <div className="amount-div">
              <label htmlFor="amount">Total Amount (LKR) :</label>
              <input
                type="text" // Change to text to control input format
                id="amount"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^\d]/g, ""); // Allow only numbers
                  setAmount(value);
                }}
                placeholder="Enter amount - min 150 LKR"
              />
            </div>

            {/* Buttons for Confirm and Decline */}
            <button
              onClick={handleConfirm}
              className={isValidAmount(amount) ? "accept-button" : "inactive-button"}
              disabled={!isValidAmount(amount)} // Disable if amount is invalid
            >
              Confirm
            </button>

            <button onClick={handleDecline} className="decline-btn">
              Decline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptByLaundry;
