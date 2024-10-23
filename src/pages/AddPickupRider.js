import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import "../styles/AddPickupRider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { API_ENDPOINT } from "../config";

const AddPickupRider = () => {
  const laundryId = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [riders, setRiders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState("");
  const [showRiders, setShowRiders] = useState(false);
  const [verifiedOrders, setVerifiedOrders] = useState(new Set());
  const [expandedOrders, setExpandedOrders] = useState(new Set()); // Manage which orders are expanded

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(
          API_ENDPOINT.GET_Orders_By_Laundry_Id.replace(":laundry_id", laundryId),
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
        setOrders(data.orders || []);
        const statusThreeOrders = data.orders.filter(
          (order) =>
            order.orderStatus === 3 && order.pickup_delivery_rider_id === null
        );
        setFilteredOrders(statusThreeOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        
      }
    };

    fetchOrders();
  }, [laundryId, storedToken]);

  // Fetch available riders
  const fetchRiders = async () => {
    try {
      const response = await fetch(
        API_ENDPOINT.GET_Riders.replace(":laundry_id", laundryId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch riders");
      }

      const data = await response.json();
      setRiders(data);
    } catch (error) {
      console.error("Error fetching riders:", error);
      setError("Failed to fetch riders.");
    }
  };

  // Verify payment for the selected order and fetch riders
  const handleVerifyPayment = async (orderId) => {
    const confirmed = window.confirm(
      "Are you done with the payment? Please confirm to proceed."
    );

    if (!confirmed) return;

    setSelectedOrder(orderId);
    setShowRiders(true);
    await fetchRiders();

    setVerifiedOrders((prev) => new Set(prev).add(orderId));
  };

  // Toggle expand/collapse order details
  const handleToggleExpand = (orderId) => {
    setExpandedOrders((prev) => {
      const newExpandedOrders = new Set(prev);
      if (newExpandedOrders.has(orderId)) {
        newExpandedOrders.delete(orderId); // Collapse if already expanded
      } else {
        newExpandedOrders.add(orderId); // Expand only the selected order
      }
      return newExpandedOrders;
    });
  };

  // Assign a rider for pickup
  const handleAssignRider = async (riderId) => {
    if (!selectedOrder) return;

    const confirmed = window.confirm(
      `Are you sure you want to assign ${
        riders.find((rider) => rider.id === riderId)?.name
      } as the rider for this order?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(API_ENDPOINT.SET_Riders, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: selectedOrder,
          pickupDeliveryRiderId: riderId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to assign rider");
      }

      alert("Rider assigned successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error assigning rider:", error);
      setError("Failed to assign rider.");
    }
  };

  return (
    <div className="add-pickup-rider-container">
      <NavBar />
      <div className="add-rider-content">
        <h2>Verify Payment</h2>
        {error && <p className="error-message">{error}</p>}

        <table className="payment-verified-order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Amount</th>
              <th>Paid On</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.id}</td>
                    <td>{order.price} LKR</td>
                    <td>
                      {new Date(
                        order.confirmedByHotelDateTime
                      ).toLocaleDateString()}
                    </td>
                    <td className="see-more-btn">
                      <button onClick={() => handleToggleExpand(order.id)}>
                        {expandedOrders.has(order.id) ? "Collapse" : "See more..."}
                      </button>
                    </td>
                    <td className="verify-payment-btn">
                      <button
                        className={
                          verifiedOrders.has(order.id) ? "verified-btn" : ""
                        }
                        onClick={() => handleVerifyPayment(order.id)}
                        disabled={verifiedOrders.has(order.id)}
                        style={{
                          color: verifiedOrders.has(order.id)
                            ? "#fff"
                            : undefined, // Set color to white if verified
                          opacity: verifiedOrders.has(order.id) ? 0.8 : 1, // Optional: Change opacity for better visibility
                        }}
                      >
                        {verifiedOrders.has(order.id) ? "Verified" : "Verify"}
                      </button>
                    </td>
                  </tr>

                  {/* Order details rendered outside of the table to avoid layout shift */}
                  {expandedOrders.has(order.id) && (
                    <tr className="expanded-order-row" style={{backgroundColor: "#fff"}}>
                      <td colSpan="5">
                        <div className="pickup-order-details-modal">
                          <h4 style={{ color: "red" }}>
                            Caution! If you have any concerns about the payment
                            <br />
                            contact the hotel.
                          </h4>
                          <h3>Order Details</h3>

                          <p>
                            <strong>Order ID:</strong> {order.id}
                          </p>
                          <strong>Clothing Items:</strong>
                          <ul>
                            {order.clothingItems.map((item) => {
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
                            <strong>Weight:</strong> {order.weight || "Not set"}
                          </p>
                          <p>
                            <strong>Special Notes:</strong>{" "}
                            {order.special_notes || "None"}
                          </p>

                          <h3>Hotel Details</h3>
                          <p>
                            <strong>Hotel Name:</strong>{" "}
                            {order.hotel_details.hotel_name}
                          </p>
                          <p>
                            <strong>Address:</strong>{" "}
                            {order.hotel_details.address || "N/A"}
                          </p>
                          <p>
                            <strong>Nearest City:</strong>{" "}
                            {order.hotel_details.nearest_city || "N/A"}
                          </p>
                          <p>
                            <strong>Phone Number:</strong>{" "}
                            {order.hotel_details.phone_number || "N/A"}
                          </p>
                          <p>
                            <strong>Email:</strong>{" "}
                            {order.hotel_details.email || "N/A"}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4">No Orders to Verify</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Show riders only if payment is verified */}
        {showRiders && selectedOrder && (
          <div>
            <h3 style={{color: "red"}}>Please note: Verification will be completed after a pickup rider is assigned for this order.</h3>
            <h2>Assign a Pickup Rider for Order ID: {selectedOrder}</h2>
            <table className="rider-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th>Email</th>
                  <th>NIC</th>
                </tr>
              </thead>
              <tbody>
                {riders.length > 0 ? (
                  riders.map((rider) => (
                    <tr key={rider.id}>
                      <td>{rider.name}</td>
                      <td>{rider.phone_number}</td>
                      <td>{rider.address}</td>
                      <td>{rider.email}</td>
                      <td>{rider.NIC}</td>
                      <td>
                        <button
                          className="assign-btn"
                          onClick={() => handleAssignRider(rider.id)}
                        >
                          Assign
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No riders available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default AddPickupRider;
