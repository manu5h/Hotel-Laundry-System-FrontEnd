import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/OnGoingOrders.css"; // Add styles for the table and timeline

const OnGoingOrders = () => {
  const hotelID = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [laundryMap, setLaundryMap] = useState({});
  const [orders, setOrders] = useState([]);
  const [expandedItemId, setExpandedItemId] = useState(null); // For items
  const [expandedStatusId, setExpandedStatusId] = useState(null); // For status

  // Fetch orders by hotel ID
  useEffect(() => {
    const fetchOngoingOrders = async () => {
      try {
        const response = await fetch(
          API_ENDPOINT.GET_Orders_By_Hotel_Id.replace(":hotel_id", hotelID),
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
        // Filter out completed orders (status = 8)
        const ongoingOrders = data.orders.filter((order) => order.orderStatus !== 8);
        setOrders(ongoingOrders);
      } catch (error) {
        console.error("Error fetching ongoing orders:", error);
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
        const laundryMap = {};
        data.laundries.forEach((laundry) => {
          laundryMap[laundry.id] = laundry.laundry_name;
        });
        setLaundryMap(laundryMap);
      } catch (error) {
        console.error("Error fetching laundries:", error);
      }
    };

    fetchOngoingOrders();
    fetchLaundries();
  }, [hotelID, storedToken]);

  // Function to toggle item details
  const toggleExpandItems = (orderId) => {
    setExpandedItemId(expandedItemId === orderId ? null : orderId);
  };

  // Function to toggle status details
  const toggleExpandStatus = (orderId) => {
    setExpandedStatusId(expandedStatusId === orderId ? null : orderId);
  };

  // Function to determine the current status
  const getCurrentStatus = (order) => {
    if (order.orderCompletedDateTime) return "Order Completed";
    if (order.pickupFromLaundryDateTime) return "Picked up from Laundry";
    if (order.laundryCompletedDateTime) return "Laundry Process Completed";
    if (order.handedToLaundryDateTime) return "Handed to Laundry";
    if (order.pickupFromHotelDateTime) return "Picked up from Hotel";
    if (order.confirmedByHotelDateTime) return "Confirmed by Hotel";
    if (order.requestedToLaundryDateTime) return "Requested to Laundry";
    return "Pending";
  };

  // Render the timeline horizontally
  const renderOrderTimeline = (order) => {
    const timelineSteps = [
      { label: "Requested", time: order.requestedToLaundryDateTime },
      { label: "Confirmed", time: order.confirmedByHotelDateTime },
      { label: "Picked up from Hotel", time: order.pickupFromHotelDateTime },
      { label: "Handed to Laundry", time: order.handedToLaundryDateTime },
      {
        label: "Laundry Process Completed",
        time: order.laundryCompletedDateTime,
      },
      {
        label: "Picked up from Laundry",
        time: order.pickupFromLaundryDateTime,
      },
      { label: "Order Completed", time: order.orderCompletedDateTime },
    ];

    return (
      <div className="horizontal-timeline">
        {timelineSteps.map((step, index) => (
          <div key={index} className="timeline-step-horizontal">
            <div className="timeline-icon-wrapper">
              <div
                className={`timeline-icon ${
                  step.time ? "completed" : "pending"
                }`}
              ></div>
            </div>
            <div className="timeline-label-wrapper">
              <span className="timeline-label">{step.label}</span>
            </div>
            <div className="timeline-time">
              {step.time ? new Date(step.time).toLocaleString() : "Pending"}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render clothing items for an order
  const renderClothingItems = (clothingItems) => {
    if (!clothingItems || clothingItems.length === 0) {
      return <div>No items found for this order.</div>;
    }

    return (
      <table className="order-items-table">
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
          {clothingItems.map((item) => (
            <tr key={item.id}>
              <td>{item.category}</td>
              <td>{item.cleaningType}</td>
              <td>{item.pressing_ironing ? "Yes" : "No"}</td>
              <td>{item.stain_removal ? "Yes" : "No"}</td>
              <td>{item.folding ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="ongoing-orders-container">
      <NavBar />
      <div className="ongoing-orders-div">
        <h2>Ongoing Orders</h2>
        <table className="ongoing-orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Laundry</th>
              <th>Price</th>
              <th>Items</th>
              <th>Last Saved Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{order.id}</td>
                  <td>{laundryMap[order.laundry_id] || "Unknown Laundry"}</td>
                  <td>{order.price} LKR</td>
                  <td>
                    <button
                      className="total-item-btn"
                      onClick={() => toggleExpandItems(order.id)}
                    >
                      {expandedItemId === order.id
                        ? "Hide Items"
                        : order.clothingItems?.length}
                    </button>
                  </td>
                  <td>
                    <button
                      className="add-feedback-btn"
                      onClick={() => toggleExpandStatus(order.id)}
                    >
                      {expandedStatusId === order.id
                        ? "Hide Status"
                        : getCurrentStatus(order)}
                    </button>
                  </td>
                </tr>

                {/* Expanded row for items */}
                {expandedItemId === order.id && (
                  <tr className="expanded-row">
                    <td colSpan="5">
                      <div className="expanded-content">
                        <h4>Items in this order:</h4>
                        {renderClothingItems(order.clothingItems)}
                      </div>
                    </td>
                  </tr>
                )}

                {/* Expanded row for status */}
                {expandedStatusId === order.id && (
                  <tr className="expanded-row">
                    <td colSpan="5">
                      <div className="expanded-content-timeline">
                        {renderOrderTimeline(order)}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OnGoingOrders;
