import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import "../styles/PendingPayments.css";
import { API_ENDPOINT } from "../config";

const PendingPayment = () => {
  const hotelId = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [laundryDetails, setLaundryDetails] = useState({});

  const [pendingConfirmationOrders, setPendingConfirmationOrders] = useState(
    []
  ); // Orders with orderStatus = 1
  const [laundries, setLaundries] = useState([]); // List of all laundries
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
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

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data.orders); // Set all fetched orders

        // Filter pending confirmation orders (orderStatus = 1)
        const pendingOrders = data.orders.filter(
          (order) => order.orderStatus === 1
        );
        setPendingConfirmationOrders(pendingOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to fetch orders.");
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
        setLaundries(data.laundries); // Set fetched laundries
      } catch (error) {
        console.error("Error fetching laundries:", error);
        setError("Failed to fetch laundries.");
      }
    };

    fetchOrders();
    fetchLaundries();
  }, [hotelId, storedToken]);

  // Function to handle accepting the order
  const handleAccept = async (orderId) => {
    const confirmed = window.confirm(
      "Are you done with the payment? Please confirm to accept this order."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        API_ENDPOINT.CONFIRM_order_hotel.replace(":hotel_id", hotelId).replace(
          ":order_id",
          orderId
        ),
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
      window.location.reload();
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order.");
    }
  };

  // Function to handle declining the order
  const handleDecline = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to decline this order?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        API_ENDPOINT.DECLINE_order_hotel.replace(":hotel_id", hotelId).replace(
          ":order_id",
          orderId
        ),
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
      alert(
        "The order has been successfully declined. You can now assign it to a different laundry."
      );

      window.location.reload();
    } catch (error) {
      console.error("Error declining order:", error);
      setError("Failed to decline order.");
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
        setLaundryDetails(data.laundry);
      } else {
        setError("Failed to fetch laundry details.");
      }
    } catch (error) {
      console.error("Error fetching laundry details:", error);
      setError("Failed to fetch laundry details.");
    }
  };

  // Function to get laundry name by ID
  const getLaundryNameById = (id) => {
    const laundry = laundries.find((l) => l.id === id);
    return laundry ? laundry.laundry_name : "Unknown Laundry";
  };

  return (
    <div className="pending-payment-main-container">
      <NavBar />
      <div className="pending-payment">
        <h2 style={{ marginBottom: "0" }}>Pending Payments</h2>
        {error && <p className="error-message">{error}</p>}

        <table className="pending-payment-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Laundry Name</th>
              <th>Date</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.filter((order) => order.orderStatus === 2).length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No pending orders.
                </td>
              </tr>
            ) : (
              orders
                .filter((order) => order.orderStatus === 2) // Only show confirmed orders
                .map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{getLaundryNameById(order.laundry_id)}</td>{" "}
                    {/* Get laundry name by ID */}
                    <td>
                      {order.created_time
                        ? order.created_time.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td>{order.price ? `${order.price} LKR` : "N/A"}</td>
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

            <h3>Laundry Bank Details:</h3>
            {laundryDetails.bank_name ? (
              <>
                <p>
                  <strong>Bank:</strong> {laundryDetails.bank_name}
                </p>
                <p>
                  <strong>Account Name:</strong>{" "}
                  {laundryDetails.bank_account_holder_name}
                </p>
                <p>
                  <strong>Account Number:</strong>{" "}
                  {laundryDetails.bank_account_number}
                </p>
                <p>
                  <strong>Branch:</strong> {laundryDetails.bank_branch}
                </p>
              </>
            ) : (
              <p>No bank details available</p>
            )}

            <p style={{ color: "#06d001", fontSize: "18px" }}>
              <strong style={{ color: "#06d001", fontSize: "18px" }}>
                Price:{" "}
              </strong>{" "}
              {selectedOrder.price + " LKR" || "Not set"}
            </p>

            <div className="button-group">
              <button
                onClick={() => handleAccept(selectedOrder.id)}
                className="accept-button"
              >
                Pay and Accept
              </button>
              <button
                onClick={() => handleDecline(selectedOrder.id)}
                className="decline-btn"
              >
                Decline
              </button>
            </div>
          </div>
        )}

        <h2 className="toBeConfirm-text">To be confirmed</h2>

        {pendingConfirmationOrders.length === 0 ? (
          <p className="no-orders-message">No pending confirmation orders.</p>
        ) : (
          <table className="pending-confirmation-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Laundry Name</th>
                <th>Requested Date</th>
              </tr>
            </thead>
            <tbody>
              {pendingConfirmationOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{getLaundryNameById(order.laundry_id)}</td>
                  <td>{order.created_time.slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default PendingPayment;
