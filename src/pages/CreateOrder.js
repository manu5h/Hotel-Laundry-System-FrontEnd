import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ENDPOINT } from "../config";
import NavBar from "../components/NavBar";
import "../styles/CreateOrder.css";

const CreateOrder = () => {
  const id = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const [items, setItems] = useState([]); // Ensure items is an array
  const [selectedItemIds, setSelectedItemIds] = useState([]); // Track selected items
  const [weight, setWeight] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

 // Fetch items for the hotel
useEffect(() => {
  fetch(API_ENDPOINT.GET_Items.replace(":hotel_id", id), {
    headers: { Authorization: `Bearer ${storedToken}` },
  })
    .then((response) => response.json())
    .then((data) => {
      if (Array.isArray(data.clothingItems)) {
        // Filter items where order_id is null
        const filteredItems = data.clothingItems.filter(item => item.order_id === null);
        setItems(filteredItems); // Set the filtered items
      } else {
        console.error("Expected an array but got:", data);
        setItems([]); // Fallback to empty array if clothingItems is not found
      }
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      setItems([]); // Fallback to empty array on error
    });
}, [id, storedToken]);


  // Handle checkbox selection
  const handleSelectItem = (itemId) => {
    if (selectedItemIds.includes(itemId)) {
      setSelectedItemIds(selectedItemIds.filter((id) => id !== itemId));
    } else {
      setSelectedItemIds([...selectedItemIds, itemId]);
    }
  };

  // Validate form
  const validateForm = () => {
    if (selectedItemIds.length === 0) {
      setErrorMessage("Please select at least one item.");
      return false;
    }

    setErrorMessage(""); // Clear error message
    return true;
  };

  // Handle order submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop submission if validation fails
    }

    const body = {
      weight: parseFloat(weight),
      special_notes: specialNotes,
      itemIds: selectedItemIds,
    };

    try {
      const response = await fetch(API_ENDPOINT.CREATE_Order.replace(":hotel_id", id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert("Failed to create order. Try again later!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Order created successfully!");
      alert("Order created successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.log("body=" + body);
      console.error(error);
    }
  };

  return (
    <div className="create-order-main-container">
      <NavBar />
      <form className="create-order-form" onSubmit={handleSubmit}>
        <h2>Select Items for the Order</h2>

        {items.length > 0 ? (
          <div className="item-description">
            <table>
              <thead>
                <tr>
                  <th>Item ID</th>
                  <th>Category</th>
                  <th>Cleaning Type</th>
                  <th>Created Date</th>
                  <th>Created Time</th>
                 
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.category}</td>
                    <td>{item.cleaningType}</td>
                    <td>{new Date(item.created_time).toLocaleDateString()}</td>
                    <td>
                      {new Date(item.created_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        value={item.id}
                        className="create-order-checkBox"
                        checked={selectedItemIds.includes(item.id)}
                        onChange={() => handleSelectItem(item.id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{color: "red"}}>Add atleast one item before create an order !</p>
        )}

        <h2>Weight in kg (Optional)</h2>
        <input
          type="number"
          className="weight-input"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Ex: 10.5"
          step="0.1"
        />

        <h2>Special Notes (Optional)</h2>
        <textarea
          value={specialNotes}
          onChange={(e) => setSpecialNotes(e.target.value)}
          className="weight-input"
          placeholder="Ex: Please handle with care"
          maxLength={250}
          style={{ resize: "none" }}
        />

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <br></br>
        <button className="create-order-form-btn" type="submit">
          Create Order
        </button>
      </form>
    </div>
  );
};

export default CreateOrder;
