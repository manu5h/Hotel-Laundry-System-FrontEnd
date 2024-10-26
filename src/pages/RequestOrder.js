import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "../styles/RequestOrder.css";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import { faStar as faStarFilled } from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";

const RequestLaundry = () => {
  const [laundries, setLaundries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(API_ENDPOINT.GET_All_Laundries)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.laundries)) {
          setLaundries(data.laundries);
        } else {
          console.error("Unexpected response data:", data);
        }
      })
      .catch((error) => {
        console.error("Error fetching laundries:", error);
      });
  }, []);

  const renderStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarFilled}
            className="filled-star"
          />
        ); // Filled star
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarOutline}
            className="outlined-star"
          />
        ); // Outlined star
      }
    }

    return stars;
  };

  const handleSelectLaundry = (laundryId) => {
    // Pass laundryId to the next page using state
    navigate(`/RequestOrder/Page2`, { state: { laundryId } });
  };

  // Filter laundries based on search term
  const filteredLaundries = laundries.filter(
    (laundry) =>
      laundry.laundry_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      laundry.nearest_city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="Request-order-bg">
      <NavBar />
      <div className="request-order-main-container">
        <h2>Select Laundry for Order Request</h2>

        {/* Search Input */}
        <input
          type="text"
          className="request-order-search"
          placeholder="Search by name or city"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginBottom: "20px",
            padding: "10px",
            width: "58%",
            borderRadius: "5px",
          }}
        />

        {filteredLaundries.length > 0 ? (
          <table className="request-order-laudry-list-table">
            <thead>
              <tr>
                <th>Laundry Name</th>
                <th>City</th>
                <th>Ratings</th>
              </tr>
            </thead>
            <tbody>
              {filteredLaundries.map((laundry) => (
                <tr key={laundry.id}>
                  <td>{laundry.laundry_name}</td>
                  <td>{laundry.nearest_city}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {/* Render the stars based on the rating */}
                      {renderStars(laundry.rating)}

                      {/* Show review count lightly */}
                      <span style={{ marginLeft: "10px", color: "#aaa" }}>
                        (Reviews: {laundry.review_count})
                      </span>
                    </div>
                  </td>
                  <td style={{ position: "relative" }}>
                    <div
                      className="arrow-container"
                      onClick={() => handleSelectLaundry(laundry.id)}
                    >
                      <FontAwesomeIcon icon={faArrowRight} size="2xl" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "red" }}>No laundries available!</p>
        )}
      </div>
    </div>
  );
};

export default RequestLaundry;
