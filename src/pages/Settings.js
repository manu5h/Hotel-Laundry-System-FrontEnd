import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { API_ENDPOINT } from "../config";
import "../styles/Settings.css";
import { IoIosArrowDown } from "react-icons/io";
import { AiFillRest } from "react-icons/ai";

const Settings = () => {
  const id = localStorage.getItem("userID");
  const storedToken = localStorage.getItem("token");

  const { role } = useParams();
  const [showUpdateProfileDropdown, setShowUpdateProfileDropdown] =
    useState(false);
  const [showChangePasswordDropdown, setShowChangePasswordDropdown] =
    useState(false);
  const [showDeleteProfileDropdown, setShowDeleteProfileDropdown] =
    useState(false);

  // State for tracking editability of each input field
  const [isEditing, setIsEditing] = useState({
    hotel_name: false,
    phone_number: false,
    address: false,
    nearest_city: false,
    laundry_name: false,
    bank_name: false,
    bank_account_number: false,
    bank_account_holder_name: false,
    name: false,
    NIC: false,
  });

  // State for inputs (initially empty but will be filled with fetched data)
  const [email, setEmail] = useState("");
  const [hotel_name, setHotelName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nearest_city, setNearestCity] = useState("");
  const [laundry_name, setLaundryName] = useState("");
  const [bank_name, setBankName] = useState("");
  const [bank_account_number, setBankAccountNumber] = useState("");
  const [bank_account_holder_name, setBankAccountHolderName] = useState("");
  const [name, setName] = useState("");
  const [NIC, setNIC] = useState("");

  const [currentPassword, setcurrentPassword] = useState("");
  const [newPassword, setnewPassword] = useState("");

  // Function to fetch details based on role
  const fetchDetails = async () => {
    let url;

    if (role === "Hotel") {
      url = API_ENDPOINT.GET_Hotel_details.replace(":hotel_id", id);
    } else if (role === "Laundry") {
      url = API_ENDPOINT.GET_Laundry_details.replace(":laundry_id", id);
    } else {
      url = API_ENDPOINT.GET_Rider_details.replace(":rider_id", id);
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${storedToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (role === "Hotel") {
        setEmail(data.hotel.email);
        setHotelName(data.hotel.hotel_name);
        setPhoneNumber(data.hotel.phone_number);
        setAddress(data.hotel.address);
        setNearestCity(data.hotel.nearest_city);
      } else if (role === "Laundry") {
        setEmail(data.laundry.email);
        setLaundryName(data.laundry.laundry_name);
        setPhoneNumber(data.laundry.phone_number);
        setAddress(data.laundry.address);
        setNearestCity(data.laundry.nearest_city);
        setBankName(data.laundry.bank_name);
        setBankAccountNumber(data.laundry.bank_account_number);
        setBankAccountHolderName(data.laundry.bank_account_holder_name);
      } else {
        setEmail(data.rider.email);
        setName(data.rider.name);
        setPhoneNumber(data.rider.phone_number);
        setAddress(data.rider.address);
        setNIC(data.rider.NIC);
      }
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value;
    // Only allow numbers and limit to 10 digits
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
      return true;
    }
  };

  // Function to save updated details
  const saveProfile = async () => {
    let url;
    let body = {};

    // Check for non-null and non-empty input values
    const inputs = [
      { value: phone_number, field: "Phone Number" },
      { value: email, field: "Email" },
      { value: address, field: "Address" },
      { value: nearest_city, field: "Nearest City" },
    ];

    if (role === "Hotel") {
      inputs.push({ value: hotel_name, field: "Hotel Name" });
    } else if (role === "Laundry") {
      inputs.push(
        { value: laundry_name, field: "Laundry Name" },
        { value: bank_name, field: "Bank Name" },
        { value: bank_account_number, field: "Bank Account Number" },
        { value: bank_account_holder_name, field: "Bank Account Holder Name" }
      );
    } else {
      inputs.push({ value: name, field: "Name" }, { value: NIC, field: "NIC" });
    }

    for (const input of inputs) {
      if (!input.value) {
        // Check for null or empty values
        alert(`${input.field} cannot be empty.`);
        return;
      }
    }

    if (phone_number.length !== 10) {
      alert("Phone number must have 10 digits.");
      return;
    }

    // Set the appropriate URL and body based on the role
    if (role === "Hotel") {
      url = API_ENDPOINT.UPDATE_HOTEL;
      body = {
        email,
        hotel_name,
        phone_number,
        address,
        nearest_city,
      };
    } else if (role === "Laundry") {
      url = API_ENDPOINT.UPDATE_LAUNDRY;
      body = {
        email,
        laundry_name,
        phone_number,
        address,
        nearest_city,
        bank_name,
        bank_account_number,
        bank_account_holder_name,
      };
    } else {
      url = API_ENDPOINT.UPDATE_DELIVERY;
      body = {
        email,
        name,
        phone_number,
        address,
        NIC,
      };
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        alert("Profile update failed. Try again later!");
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log("Profile updated successfully!");
      alert("Profile Updated Successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to change password save
  const saveChangePassword = async () => {
    let url;
    let body = {};

    // Check for non-null and non-empty input values
    const inputs = [
      { value: email, field: "Email" },
      { value: currentPassword, field: "Current Password" },
      { value: newPassword, field: "New Password" },
    ];

    for (const input of inputs) {
      if (!input.value) {
        // Check for null or empty values
        alert(`${input.field} cannot be empty.`);
        return;
      }
    }

    if (newPassword.length < 8) {
      alert("Password must have 8 charactors or above.");
      return;
    }

    // Set the appropriate URL and body based on the role
    if (role === "Hotel") {
      url = API_ENDPOINT.UPDATE_Password_hotel;
      body = {
        email,
        currentPassword,
        newPassword,
      };
    } else if (role === "Laundry") {
      url = API_ENDPOINT.UPDATE_Password_laundry;
      body = {
        email,
        currentPassword,
        newPassword,
      };
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.status === 401) {
        alert("Current password is incorrect!");
        throw new Error(`HTTP error! status: ${response.status}`);
      } else if (!response.ok) {
        alert("Change password failed. Try again later!");
        console.log(email, newPassword, currentPassword);
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        console.log("Profile updated successfully!");
        alert("Password change Successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  // Function to discard updated details
  const discardChanges = async () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchDetails();
  }, [role, id]);

  const toggleEditMode = (field) => {
    setIsEditing((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <div className="settings-page">
      <NavBar />

      <div className="Update-profile" style={{ position: "relative" }}>
        <p
          onClick={() =>
            setShowUpdateProfileDropdown(!showUpdateProfileDropdown)
          }
          className="dropdown-button"
        >
          Update Profile{" "}
          <IoIosArrowDown
            className={showUpdateProfileDropdown ? "rotate-arrow" : ""}
          />
        </p>
        {showUpdateProfileDropdown && (
          <div className="settings-dropdown-menu">
            <ul>
              {/* Hotel profile fields */}
              {role === "Hotel" && (
                <>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Hotel Name</p>
                      <input
                        type="text"
                        readOnly={!isEditing.hotel_name}
                        placeholder="Hotel Name"
                        value={hotel_name}
                        onChange={(e) => setHotelName(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("hotel_name")}>
                        {isEditing.hotel_name ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Phone Number</p>
                      <input
                        type="text"
                        readOnly={!isEditing.phone_number}
                        placeholder="Phone Number"
                        value={phone_number}
                        onChange={(e) => handlePhoneNumberChange(e)}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <p onClick={() => toggleEditMode("phone_number")}>
                        {isEditing.phone_number ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name"> Address </p>
                      <input
                        type="text"
                        readOnly={!isEditing.address}
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("address")}>
                        {isEditing.address ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name"> Nearest City</p>
                      <input
                        type="text"
                        readOnly={!isEditing.nearest_city}
                        placeholder="Nearest City"
                        value={nearest_city}
                        onChange={(e) => setNearestCity(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("nearest_city")}>
                        {isEditing.nearest_city ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                </>
              )}

              {/* Laundry profile fields */}
              {role === "Laundry" && (
                <>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Laundry Name</p>
                      <input
                        type="text"
                        readOnly={!isEditing.laundry_name}
                        placeholder="Laundry Name"
                        value={laundry_name}
                        onChange={(e) => setLaundryName(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("laundry_name")}>
                        {isEditing.laundry_name ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Phone Number</p>
                      <input
                        type="text"
                        readOnly={!isEditing.phone_number}
                        placeholder="Phone Number"
                        value={phone_number}
                        onChange={(e) => handlePhoneNumberChange(e)}
                        maxLength={10}
                        inputMode="numeric"
                        pattern="[0-9]*"
                      />
                      <p onClick={() => toggleEditMode("phone_number")}>
                        {isEditing.phone_number ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Address</p>
                      <input
                        type="text"
                        readOnly={!isEditing.address}
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("address")}>
                        {isEditing.address ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Nearest City</p>
                      <input
                        type="text"
                        readOnly={!isEditing.nearest_city}
                        placeholder="Nearest City"
                        value={nearest_city}
                        onChange={(e) => setNearestCity(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("nearest_city")}>
                        {isEditing.nearest_city ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Bank Name</p>
                      <input
                        type="text"
                        readOnly={!isEditing.bank_name}
                        placeholder="Bank Name"
                        value={bank_name}
                        onChange={(e) => setBankName(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("bank_name")}>
                        {isEditing.bank_name ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Bank Account Number</p>
                      <input
                        type="text"
                        readOnly={!isEditing.bank_account_number}
                        placeholder="Bank Account Number"
                        value={bank_account_number}
                        onChange={(e) => setBankAccountNumber(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("bank_account_number")}>
                        {isEditing.bank_account_number ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Bank Account Holder Name</p>
                      <input
                        type="text"
                        readOnly={!isEditing.bank_account_holder_name}
                        placeholder="Bank Account Holder Name"
                        value={bank_account_holder_name}
                        onChange={(e) =>
                          setBankAccountHolderName(e.target.value)
                        }
                      />
                      <p
                        onClick={() =>
                          toggleEditMode("bank_account_holder_name")
                        }
                      >
                        {isEditing.bank_account_holder_name ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                </>
              )}

              {/* Rider profile fields */}
              {role === "Rider" && (
                <>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Name</p>
                      <input
                        type="text"
                        readOnly={!isEditing.name}
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("name")}>
                        {isEditing.name ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">Phone Number</p>
                      <input
                        type="text"
                        readOnly={!isEditing.phone_number}
                        placeholder="Phone Number"
                        value={phone_number}
                        onChange={(e) => handlePhoneNumberChange(e)}
                        maxLength={10} // Restricting the input to 10 digits
                        inputMode="numeric" // Mobile devices will show numeric keypad
                        pattern="[0-9]*" // Ensures the input contains only numbers
                      />
                      <p onClick={() => toggleEditMode("phone_number")}>
                        {isEditing.phone_number ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">address</p>
                      <input
                        type="text"
                        readOnly={!isEditing.address}
                        placeholder="Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("address")}>
                        {isEditing.address ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="inputBox-settings">
                      <p className="Field-name">NIC</p>
                      <input
                        type="text"
                        readOnly={!isEditing.NIC}
                        placeholder="NIC"
                        value={NIC}
                        onChange={(e) => setNIC(e.target.value)}
                      />
                      <p onClick={() => toggleEditMode("NIC")}>
                        {isEditing.NIC ? "Done" : "Edit"}
                      </p>
                    </div>
                  </li>
                </>
              )}
            </ul>

            <div className="save-and-discard">
              <button onClick={discardChanges} className="save-button">
                Discard
              </button>
              <button onClick={saveProfile} className="save-button">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* change password */}
      <div className="Update-profile" style={{ position: "relative" }}>
        <p
          onClick={() =>
            setShowChangePasswordDropdown(!showChangePasswordDropdown)
          }
          className="dropdown-button"
        >
          Change Password{" "}
          <IoIosArrowDown
            className={showChangePasswordDropdown ? "rotate-arrow" : ""}
          />
        </p>
        {showChangePasswordDropdown && (
          <div className="settings-dropdown-menu">
            <ul>
              <>
                <li>
                  <div className="inputBox-settings">
                    <p className="Field-name">Current Password</p>
                    <input
                      type="text"
                      placeholder="Enter Current Password"
                      value={currentPassword}
                      onChange={(e) => setcurrentPassword(e.target.value)}
                    />
                  </div>
                </li>
                <li>
                  <div className="inputBox-settings">
                    <p className="Field-name">New Password</p>
                    <input
                      type="text"
                      placeholder="Enter New Password"
                      value={newPassword}
                      onChange={(e) => setnewPassword(e.target.value)}
                    />
                  </div>
                </li>
              </>
            </ul>

            <div className="save-and-discard">
              <button onClick={discardChanges} className="save-button">
                Discard
              </button>
              <button onClick={saveChangePassword} className="save-button">
                Save
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete profile */}
      <div className="Update-profile" style={{ position: "relative" }}>
        <p
          onClick={() =>
            setShowDeleteProfileDropdown(!showDeleteProfileDropdown)
          }
          className="dropdown-button"
        >
          Delete Profile{" "}
          <IoIosArrowDown
            className={showDeleteProfileDropdown ? "rotate-arrow" : ""}
          />
        </p>
      </div>
    </div>
  );
};

export default Settings;
