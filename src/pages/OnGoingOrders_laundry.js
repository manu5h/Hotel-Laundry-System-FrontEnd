import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/RiderProcess.css";
import BG_img from "../assets/images/ongoingOrders_Laundry_bg.png";
import QRCode from "qrcode";

const OnGoing_Laundry = () => {
  const laundryID = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
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

        if (response.status !== 200) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        const validOrders = data.orders.filter(
          (order) => order.orderStatus === 5 // Adjust based on your order statuses
        );
        setOrders(validOrders);
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
  }, [laundryID, storedToken]);

  const handleAccept = async (orderId) => {
    const confirmed = window.confirm(
      "Has the laundry process been completed for this order? Please confirm to proceed."
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:5000/order/${orderId}/laundryCompleted`,
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
      window.location.reload(); // Consider using state to update orders instead
    } catch (error) {
      console.error("Error accepting order:", error);
      setError("Failed to accept order.");
    }
  };

  const handleInfoClick = (order) => {
    setSelectedOrder(order);
  };

  const downloadQRCode = async (id, qrData) => {
    try {
      const canvas = document.createElement("canvas");
      await QRCode.toCanvas(canvas, qrData, { width: 100 });

      const imageUrl = canvas.toDataURL();
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${id}-qrcode.png`;
      link.click();
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  };

  const validOrders = orders.filter((order) => order.orderStatus === 5);

  return (
    <div
      className="rider-process-main-container"
      style={{
        backgroundImage: `url(${BG_img})`,
        backgroundSize: "cover",
        minHeight: "110vh",
        backgroundPosition: "center"
      }}
    >
      <NavBar />
      <div className="rider-process-details">
        <h2 style={{ marginBottom: "0" }}>Ongoing Orders</h2>
        {error && <p className="error-message">{error}</p>}

        {validOrders.length === 0 ? (
          <p style={{ fontWeight: "bold" }}>No Ongoing Orders.</p>
        ) : (
          <table className="rider-process-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Hotel Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {validOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>
                    {order.hotel_details?.hotel_name ||
                      "Hotel info not available"}
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

                const qrData = `Order ID: ${selectedOrder.id}
                  Hotel Name: ${
                    selectedOrder.hotel_details?.hotel_name || "N/A"
                  }
                  Hotel Mobile: ${
                    selectedOrder.hotel_details?.phone_number || "N/A"
                  }
                  Hotel Address: ${
                    selectedOrder.hotel_details?.address || "N/A"
                  }
                  Item: ${item.category}, ${item.cleaningType}
                  Special Instructions: ${item.special_instructions || "None"}`;

                return (
                  <li key={item.id}>
                    {itemDetails}
                    <p style={{cursor: "pointer", color: "blue"}}
                      onClick={() =>
                        downloadQRCode(`${selectedOrder.id}-${item.id}`, qrData)
                      }
                    >
                      Download QR Code
                    </p>
                  </li>
                );
              })}
            </ul>

            <p>
              <strong>Weight:</strong> {selectedOrder.weight +"kg" || "Not set"}
            </p>
            <p>
              <strong>Special Notes:</strong>{" "}
              {selectedOrder.special_notes || "None"}
            </p>

            <h3>Hotel Details:</h3>
            {selectedOrder.hotel_details ? (
              <>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedOrder.hotel_details.hotel_name}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedOrder.hotel_details.address}
                </p>
                <p>
                  <strong>Nearest City:</strong>{" "}
                  {selectedOrder.hotel_details.nearest_city}
                </p>
                <p>
                  <strong>Phone Number:</strong>{" "}
                  {selectedOrder.hotel_details.phone_number}
                </p>
                <p>
                  <strong>Email:</strong> {selectedOrder.hotel_details.email}
                </p>
              </>
            ) : (
              <p>Hotel details not available</p>
            )}

            <div className="order-action-buttons">
              <button
                className="accept-button"
                onClick={() => handleAccept(selectedOrder.id)}
              >
                Complete Laundry
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnGoing_Laundry;
