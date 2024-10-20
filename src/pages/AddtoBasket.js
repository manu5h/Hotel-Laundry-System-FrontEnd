import React, { useState } from "react";
import { API_ENDPOINT } from "../config";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import "../styles/AddtoBasket.css";

const AddtoBasket = () => {
  const id = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const laundryTypes = [
    {
      category: "Bed Linens",
      subcategories: [
        "Sheets",
        "Pillowcases",
        "Duvet covers",
        "Mattress protectors",
      ],
    },
    {
      category: "Bathroom Linens",
      subcategories: [
        "Towels",
        "Bathmats",
        "Robes",
      ],
    },
    {
      category: "Table Linens",
      subcategories: ["Table cloths", "Napkins", "Table runners"],
    },
    {
      category: "Curtains and Drapes",
      subcategories: ["Heavy curtains", "Sheer curtains", "Window treatments"],
    },
    {
      category: "Beach and Pool Items",
      subcategories: ["Beach towels", "Pool towels", "Lounge chair covers"],
    },
    {
      category: "Uniforms",
      subcategories: [
        "Front desk uniforms",
        "Housekeeping uniforms",
        "Waitstaff uniforms",
        "Chef uniforms",
      ],
    },
    {
      category: "Miscellaneous Items",
      subcategories: ["Rugs", "Slipcovers", "Decorative textiles"],
    },
  ];

  const washingTypes = [
    { category: "Standard Washing - cold" },
    { category: "Standard Washing - warm" },
    { category: "Standard Washing - hot" },
    { category: "Dry cleaning" },
  ];

  const [selectedLaundryType, setSelectedLaundryType] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedWashingType, setSelectedWashingType] = useState("");
  const [services, setServices] = useState({
    pressing: false,
    stainRemoval: false,
    foldingPackaging: false,
  });
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateForm = () => {
    if (!selectedLaundryType) {
      setErrorMessage("Please select a laundry type.");
      return false;
    }
    if (!selectedSubcategory) {
      setErrorMessage("Please select a subcategory.");
      return false;
    }
    if (!selectedWashingType) {
      setErrorMessage("Please select a washing type.");
      return false;
    }
    setErrorMessage(""); // Clear any existing error messages
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Stop form submission if validation fails
    }

    const body = {
      category: selectedSubcategory,
      cleaningType: selectedWashingType,
      pressing_ironing: services.pressing,
      stain_removal: services.stainRemoval,
      folding: services.foldingPackaging,
      special_instructions: specialInstructions,
    };

    try {
      const response = await fetch(API_ENDPOINT.CREATE_Item.replace(":hotel_id", id), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert("Failed to add new item. Try again later!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("New item added successfully!");
      alert("New item added successfully!");
      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="add-to-basket-main-container">
      <NavBar />
      <form className="add-to-basket-form" onSubmit={handleSubmit}>
        <h2>Clothing category</h2>
        <select
          value={selectedLaundryType}
          onChange={(e) => setSelectedLaundryType(e.target.value)}
        >
          <option value="" disabled>
            Select Category
          </option>
          {laundryTypes.map((type, index) => (
            <option key={index} value={type.category}>
              {type.category}
            </option>
          ))}
        </select>

        {selectedLaundryType && (
          <div>
            <h2>Subcategory</h2>
            <select
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="" disabled>
                Select Subcategory
              </option>
              {laundryTypes
                .find((type) => type.category === selectedLaundryType)
                .subcategories.map((subcategory, index) => (
                  <option key={index} value={subcategory}>
                    {subcategory}
                  </option>
                ))}
            </select>
          </div>
        )}

        <h2>Washing Type</h2>
        <select
          value={selectedWashingType}
          onChange={(e) => setSelectedWashingType(e.target.value)}
        >
          <option value="" disabled>
            Select Washing Type
          </option>
          {washingTypes.map((type, index) => (
            <option key={index} value={type.category}>
              {type.category}
            </option>
          ))}
        </select>

        <h2>Additional Services</h2>
        <label>
          <input
            type="checkbox"
            checked={services.pressing}
            onChange={(e) =>
              setServices({ ...services, pressing: e.target.checked })
            }
          />
          Pressing/Ironing
        </label>

        <label>
          <input
            type="checkbox"
            checked={services.stainRemoval}
            onChange={(e) =>
              setServices({ ...services, stainRemoval: e.target.checked })
            }
          />
          Stain Removal
        </label>

        <label>
          <input
            type="checkbox"
            checked={services.foldingPackaging}
            onChange={(e) =>
              setServices({ ...services, foldingPackaging: e.target.checked })
            }
          />
          Folding and Packaging
        </label>

        <h2>Special Instructions (Optional)</h2>
        <textarea
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="weight-input"
          placeholder="Ex: Please handle with care."
          maxLength={250}
          style={{ resize: "none" }}
        />

        {errorMessage && (
          <p style={{ color: "red", margin: 0 }}>{errorMessage}</p>
        )}
        <br></br>

        <button className="add-to-basket-submit-btn" type="submit">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddtoBasket;
