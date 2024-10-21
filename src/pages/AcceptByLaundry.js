import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import NavBar from "../components/NavBar";
import "../styles/AcceptbyLaundry.css";

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
          `http://localhost:5000/laundry/${laundryId}/orders?orderStatus=1`,
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
        setError("Failed to fetch orders.");
      }
    };

    fetchOrders();
  }, [laundryId, storedToken]);

  // Function to handle info icon click
  const handleInfoClick = (order) => {
    setSelectedOrder(order);
    setAmount(""); // Reset amount when a new order is selected
    setSelectedOrderId(order.id); // Set selected order ID
  };

  // Function to confirm the order
  const handleConfirm = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to confirm this order?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/laundry/${laundryId}/order/${selectedOrder.id}/accept`,
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

  // Function to decline the order
  const handleDecline = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this order?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/laundry/${laundryId}/order/${selectedOrder.id}/decline`,
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

  return (
    <div className="accept-by-laundry-main-container">
      <NavBar />
      <div className="accept-by-laundry">
        <h2>Accept Orders</h2>
        {error && <p className="error-message">{error}</p>}

        <table className="accept-by-laundry-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Hotel Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(
              (order) =>
                order.orderStatus === 1 && (
                  <tr
                    key={order.id}
                    style={{
                      backgroundColor:
                        selectedOrderId === order.id ? "#06D001" : "#025a97",
                    }}
                  >
                    <td>{order.id}</td>
                    <td>{order.hotel_details.hotel_name || "N/A"}</td>
                    <td>
                      {order.created_time
                        ? `${order.created_time.slice(0, 10)}` // Extract YYYY-MM-DD
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
                )
            )}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="order-details-modal">
            <h3>Order Details</h3>
            <p>
              <strong>Order ID:</strong> {selectedOrder.id || "Not set"}
            </p>
            <h4>Clothing Items:</h4>
            <ul>
              {selectedOrder.clothingItems.map((item) => {
                // Start with the category and cleaning type
                let itemDetails = `${item.category}, ${item.cleaningType}`;

                // Append additional services if applicable
                if (item.pressing_ironing === 1) {
                  itemDetails += " , Pressing/Ironing";
                }
                if (item.stain_removal === 1) {
                  itemDetails += " , Stain Removal";
                }
                if (item.folding === 1) {
                  itemDetails += " , Folding";
                }

                // Append special instructions if they exist
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

            {/* New section for Hotel Details */}
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
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
              />
            </div>

            {/* Buttons for Confirm and Decline */}
            <button
              onClick={handleConfirm}
              className={amount ? "accept-button" : "inactive-button"}
              disabled={!amount}
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
