import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/History_hotel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";

const History_hotel = () => {
  const hotelID = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [laundryMap, setLaundryMap] = useState({});
  const [expandedOrders, setExpandedOrders] = useState([]); 
  const [reviewingOrderId, setReviewingOrderId] = useState(null);
  const [reviewValue, setReviewValue] = useState(0); 
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCompletedOrders = async () => {
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
        const filteredOrders = data.orders.filter(
          (order) => order.orderStatus === 8
        );
        setCompletedOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
        setError("Failed to fetch completed orders.");
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
        setError("Failed to fetch laundries.");
      }
    };

    fetchCompletedOrders();
    fetchLaundries();
  }, [hotelID, storedToken]);

  const handleAddReview = async (orderId) => {
    if (reviewValue < 1 || reviewValue > 5) {
      setError("Please provide a review between 1 and 5.");
      return;
    }

    try {
      const endpoint = API_ENDPOINT.ADD_Review.replace(":order_id", orderId);

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          review: reviewValue,
        }),
      });

      if (response.status === 201) {
        window.location.reload();
      } else {
        throw new Error("Failed to add review");
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setError("Failed to add review.");
    }
  };

  // Toggle for showing/hiding order items
  const toggleExpandOrderItems = (orderId) => {
    setExpandedOrders((prevExpandedOrders) =>
      prevExpandedOrders.includes(orderId)
        ? prevExpandedOrders.filter((id) => id !== orderId)
        : [...prevExpandedOrders, orderId]
    );
  };

  // Star rating display
  const renderStars = (rating, onClick, showLabels = true) => {
    const starLabels = ["Poor", "Fair", "Good", "Very Good", "Excellent"];
    return (
      <>
        {showLabels && (
          <div className="star-labels">
            {starLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
        )}
        <div className="star-rating-container">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i + 1}
              onClick={() => onClick && onClick(i + 1)}
              className="star-icon"
              style={{ marginRight: "15px" }} // Adjust spacing as needed
            >
              <FontAwesomeIcon
                icon={i + 1 <= rating ? faStarFilled : faStarOutline}
                color={i + 1 <= rating ? "#005b96" : "#ccc"}
              />
            </span>
          ))}
        </div>
      </>
    );
  };

  return (
    <div className="history-main-container">
      <NavBar />
      <div className="history-details">
        <h2>Completed Orders History</h2>
        {error && <p className="error-message">{error}</p>}
        {completedOrders.length === 0 ? (
          <p>No completed orders available.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Created Date</th>
                <th>Completion Date</th>
                <th>Laundry</th>
                <th>Price</th>
                <th>Items</th>
                <th>Review</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr style={{ cursor: "pointer" }}>
                    <td>{order.id}</td>
                    <td>{new Date(order.created_time).toLocaleString()}</td>
                    <td>
                      {new Date(order.orderCompletedDateTime).toLocaleString()}
                    </td>
                    <td>{laundryMap[order.laundry_id] || "Unknown Laundry"}</td>
                    <td>{order.price+" LKR" || "Not set"}</td>
                    <td
                      onClick={() => toggleExpandOrderItems(order.id)}
                      style={{ fontWeight: "bold" }}
                    >
                      {expandedOrders.includes(order.id)
                        ? "Hide Items"
                        : "Show Items"}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {order.review ? (
                        // If review is already submitted, show stars without labels
                        <div>{renderStars(order.review, null, false)}</div> // Show stars only
                      ) : (
                        <button
                          className="review-btn"
                          onClick={() => setReviewingOrderId(order.id)}
                        >
                          Give Feedback
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Order Items */}
                  {expandedOrders.includes(order.id) && (
                    <tr>
                      <td colSpan="7">
                        <ul>
                          {order.clothingItems.map((item) => (
                            <li key={item.id}>
                              {item.category} - {item.cleaningType}
                              {item.pressing_ironing === 1 &&
                                ", Pressing/Ironing"}
                              {item.stain_removal === 1 && ", Stain Removal"}
                              {item.folding === 1 && ", Folding"}
                              {item.special_instructions &&
                                `, Special Instructions: ${item.special_instructions}`}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}

                  {/* Review Section */}
                  {reviewingOrderId === order.id && (
                    <tr>
                      <td colSpan="7" className="feedback-row">
                        <div className="feedback-section">
                          <h4>Share your feedback for this laundry service</h4>
                          {renderStars(reviewValue, setReviewValue)}{" "}
                          {/* Show star selection for new feedback */}
                          <div>
                            <button
                              className="submit-btn"
                              onClick={() => handleAddReview(order.id)}
                            >
                              Submit Feedback
                            </button>
                            <button
                              className="cancel-btn"
                              onClick={() => setReviewingOrderId(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default History_hotel;
