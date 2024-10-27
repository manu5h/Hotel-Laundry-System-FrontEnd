import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import "../styles/PendingPayments.css";
import { API_ENDPOINT } from "../config";
import { loadStripe } from "@stripe/stripe-js";

const PendingPayment = () => {
  const stripePromise = loadStripe(
    "pk_test_51QE9dWIB1uUhWWTtvcIyWgCjDfwzEZwa2gqnaKFxZaE5UZUx8QWh9701jsKnkeDOLZx7Oe4jxXm9ByoN1fTNIlRH00jJ01QviH"
  );
  const hotelId = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [laundryDetails, setLaundryDetails] = useState({});
  const [pendingConfirmationOrders, setPendingConfirmationOrders] = useState([]);
  const [laundries, setLaundries] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handlePaymentAndAccept = async (orderId, price) => {
    const stripe = await stripePromise;

    // Save order ID in localStorage before making the fetch request
    localStorage.setItem("orderID", orderId);

    try {
        // Create a checkout session
        const response = await fetch("http://localhost:5000/payment/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId, price }), // Include price here
        });

        // Check for server response issues
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Checkout session error response:", errorText);
            throw new Error("Failed to create checkout session");
        }

        const session = await response.json();

        // Redirect to Stripe Checkout
        const { error } = await stripe.redirectToCheckout({
            sessionId: session.id,
        });

        if (error) {
            console.error("Stripe checkout error:", error);
        }
    } catch (error) {
        console.error("Error in payment and accept:", error);
        setError("Payment process failed. Please try again.");
    }
};



  const fetchOrders = async () => {
    try {
      const response = await fetch(
        API_ENDPOINT.GET_Orders_By_Hotel_Id.replace(":hotel_id", hotelId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      setOrders(data.orders);
      const pendingOrders = data.orders.filter((order) => order.orderStatus === 1);
      setPendingConfirmationOrders(pendingOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Could not fetch orders.");
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

      if (!response.ok) throw new Error("Failed to fetch laundries");

      const data = await response.json();
      setLaundries(data.laundries);
    } catch (error) {
      console.error("Error fetching laundries:", error);
      setError("Could not fetch laundries.");
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchLaundries();
  }, [hotelId, storedToken]);

  const handleAccept = async () => {
    if (!selectedOrder) return;

    const confirmed = window.confirm("Confirm payment completed to accept this order.");
    if (!confirmed) return;

    try {
      await handlePaymentAndAccept(selectedOrder.id, selectedOrder.price); 
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Order acceptance failed.");
    }
  };

  const handleDecline = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to decline this order?");
    if (!confirmed) return;

    try {
      const response = await fetch(
        API_ENDPOINT.DECLINE_order_hotel.replace(":hotel_id", hotelId).replace(":order_id", orderId),
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to decline order");

      alert("Order declined successfully. You can now assign it to a different laundry.");
      window.location.reload();
    } catch (error) {
      console.error("Error declining order:", error);
      setError("Order decline failed.");
    }
  };

  const handleInfoClick = async (order) => {
    setSelectedOrder(order);

    try {
      const response = await fetch(
        API_ENDPOINT.GET_Laundry_details.replace(":laundry_id", order.laundry_id),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setLaundryDetails(data.laundry);
      } else {
        setError("Failed to fetch laundry details.");
      }
    } catch (error) {
      console.error("Error fetching laundry details:", error);
      setError("Laundry details fetch failed.");
    }
  };

  const getLaundryNameById = (id) => {
    const laundry = laundries.find((l) => l.id === id);
    return laundry ? laundry.laundry_name : "Unknown Laundry";
  };

  return (
    <div className="pending-payment-main-container">
      <NavBar />
      <div className="pending-payment">
        <h2>Pending Payments</h2>
        {error && <p className="error-message">{error}</p>}

        <table className="pending-payment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Laundry Name</th>
              <th>Date</th>
              <th>Price</th>
              <th>Actions</th> {/* Added Actions column */}
            </tr>
          </thead>
          <tbody>
            {orders.filter((order) => order.orderStatus === 2).length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>No pending orders.</td>
              </tr>
            ) : (
              orders.filter((order) => order.orderStatus === 2).map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getLaundryNameById(order.laundry_id)}</td>
                  <td>{order.created_time ? order.created_time.slice(0, 10) : "N/A"}</td>
                  <td>{order.price ? `${order.price} LKR` : "N/A"}</td>
                  <td style={{ position: "relative" }}>
                    <div className="arrow-container" onClick={() => handleInfoClick(order)}>
                      <FontAwesomeIcon icon={faArrowRight} size="2xl" />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="order-details-modal">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {selectedOrder.id || "Not set"}</p>
            <h4>Clothing Items:</h4>
            <ul>
              {selectedOrder.clothingItems.map((item) => {
                let itemDetails = `${item.category}, ${item.cleaningType}`;
                if (item.pressing_ironing === 1) itemDetails += ", Pressing/Ironing";
                if (item.stain_removal === 1) itemDetails += ", Stain Removal";
                if (item.folding === 1) itemDetails += ", Folding";
                if (item.special_instructions) itemDetails += `, Special Instructions: ${item.special_instructions}`;
                return <li key={item.id}>{itemDetails}</li>;
              })}
            </ul>
            <p><strong>Weight:</strong> {selectedOrder.weight || "Not set"}</p>
            <p><strong>Special Notes:</strong> {selectedOrder.special_notes || "None"}</p>

            <div className="modal-actions">
              <button style={{ width: "270px" }} onClick={handleAccept}>Accept & Pay via STRIPE</button>
              <button onClick={() => handleDecline(selectedOrder.id)}>Decline</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingPayment;
