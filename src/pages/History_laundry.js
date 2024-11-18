import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/History_hotel.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import "../styles/History_laundry.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const History_laundry = () => {
  const [laundryList, setLaundryList] = useState([]);
  const laundryID = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [completedOrders, setCompletedOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [error, setError] = useState("");
  const [hotelOrderCounts, setHotelOrderCounts] = useState({});

  useEffect(() => {
    const fetchCompletedOrders = async () => {
      try {
        const response = await fetch(
          API_ENDPOINT.GET_Orders_By_Laundry_Id.replace(
            ":laundry_id",
            laundryID
          ),
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${storedToken}`,
              "Content-Type": "application/json",
            },
          }
        );


        const data = await response.json();
        const filteredOrders = data.orders.filter(
          (order) => order.orderStatus === 8
        );

        setCompletedOrders(filteredOrders);

        const hotelCounts = {};
        filteredOrders.forEach((order) => {
          const hotelId = order.hotel_details.id;
          const hotelName = order.hotel_details.hotel_name;
          hotelCounts[hotelName] = (hotelCounts[hotelName] || 0) + 1;
        });
        setHotelOrderCounts(hotelCounts);
      } catch (error) {
        console.error("Error fetching completed orders:", error);
      }
    };

    fetchCompletedOrders();
  }, [laundryID, storedToken]);

  useEffect(() => {
    const getLaundryDetails = async () => {
      try {
        const response = await fetch(API_ENDPOINT.GET_All_Laundries, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 200)
          throw new Error("Failed to fetch laundry details");

        const data = await response.json();
        setLaundryList(data.laundries);
      } catch (error) {
        console.error("Error fetching laundry details:", error);
      }
    };
    getLaundryDetails();
  }, []);

  const toggleExpandOrderItems = (orderId) => {
    setExpandedOrders((prevExpandedOrders) =>
      prevExpandedOrders.includes(orderId)
        ? prevExpandedOrders.filter((id) => id !== orderId)
        : [...prevExpandedOrders, orderId]
    );
  };

  const calculateTotalEarnings = () => {
    const currentMonth = new Date().getMonth(); // Get current month (0-11)
    const currentYear = new Date().getFullYear(); // Get current year

    return completedOrders.reduce((total, order) => {
      const orderDate = new Date(order.created_time); // Convert order created time to Date object
      // Check if the order was completed in the current month and year
      if (
        orderDate.getMonth() === currentMonth &&
        orderDate.getFullYear() === currentYear
      ) {
        return total + order.price; // Add to total if it matches
      }
      return total; // Otherwise, return the total unchanged
    }, 0);
  };

  const renderStars = (rating, onClick, showLabels = true) => {
    return (
      <>
        
        <div className="star-rating-container">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i + 1}
              onClick={() => onClick && onClick(i + 1)}
              className="star-icon"
              style={{ marginRight: "15px" }}
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

  // Data for the pie chart
  const pieData = {
    labels: Object.keys(hotelOrderCounts),
    datasets: [
      {
        label: "Number of Orders by Hotel",
        data: Object.values(hotelOrderCounts),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const totalEarnings = calculateTotalEarnings(); // Calculate total earnings here

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
                <th>Hotel</th>
                <th>Price</th>
                <th>Items</th>
                <th>Review</th>
                <th>Feedback</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr>
                    <td>{order.id}</td>
                    <td>{new Date(order.created_time).toLocaleString()}</td>
                    <td>
                      {new Date(order.orderCompletedDateTime).toLocaleString()}
                    </td>
                    <td>
                      {order.hotel_details.hotel_name || "Unknown Laundry"}
                    </td>
                    <td>{order.price + " LKR" || "Not set"}</td>
                    <td
                      onClick={() => toggleExpandOrderItems(order.id)}
                      style={{ fontWeight: "bold" ,  cursor: "pointer"}}
                    >
                      {expandedOrders.includes(order.id)
                        ? "Hide Items"
                        : "Show Items"}
                    </td>
                    <td style={{ fontWeight: "bold" }}>
                      {order.review ? (
                        <div>{renderStars(order.review, null, false)}</div>
                      ) : (
                        <p>N/A</p>
                      )}
                    </td>
                    <td style={{maxWidth: "300px"}}>{order.feedback || "Not given"}</td>
                  </tr>
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
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
        <h2>Performance Analysis</h2>
        <div className="performance-row">
          <div className="text-displays">
            <p className="total-orders">
              Total Completed Orders: {completedOrders.length}
            </p>
            {laundryList.length > 0 && (
              <div className="laundry-details">
                {laundryList.find(
                  (laundry) => laundry.id === parseInt(laundryID)
                ) ? (
                  <>
                    <div className="current-rating">
                      <p>
                        Current Rating{" "}
                        {laundryList.find(
                          (laundry) => laundry.id === parseInt(laundryID)
                        ).rating ? (
                          <div className="total-stars">
                            {renderStars(
                              laundryList.find(
                                (laundry) => laundry.id === parseInt(laundryID)
                              ).rating
                            )}
                          </div>
                        ) : (
                          <p>N/A</p>
                        )}
                      </p>
                    </div>

                    <div className="total-reviews">
                      <p>
                        Total Reviews:{" "}
                        {
                          laundryList.find(
                            (laundry) => laundry.id === parseInt(laundryID)
                          ).review_count
                        }
                      </p>
                    </div>
                  </>
                ) : (
                  <p>Laundry not found.</p>
                )}
              </div>
            )}

            <p className="total-earnings">
              Current Month Earning: {totalEarnings} LKR
            </p>
          </div>

          <div className="chart-display">
            <div className="chart-container">
              <h3 style={{margin: "0"}}>Orders by Hotel</h3>
              <Pie data={pieData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default History_laundry;
