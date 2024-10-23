import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const RegisterRider = () => {
  const navigate = useNavigate();
  const laundry_id = localStorage.getItem("userID");

  // State for inputs
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [NIC, setNIC] = useState("");

  // State for handling errors and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (email) => {
    try {
      const response = await fetch(API_ENDPOINT.SEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      console.log("Response from OTP API:", result);
      if (response.status===200) {
        console.log("OTP sent successfully!");
        console.log(email);
        return true;
      } else {
        console.error("Failed to send OTP:", result.error);
        setError("Failed to send OTP. Please try again.");
        return false;
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP.");
      return false;
    }
  };

  // Handle form submission and navigate to the next page
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error
    setError("");

    const phoneRegex = /^0\d{9}$/; 
    if (!phoneRegex.test(phone_number)) {
      setError("Phone number must start with 0 and be exactly 10 digits.");
      return;
    }

    const formData = {
      email,
      name,
      phone_number,
      address,
      NIC,
      laundry_id
    };

    // Set loading state
    setLoading(true);

    // Send OTP
    const otpSent = await sendOtp(formData.email);
    
    // Navigate to the next page if OTP was sent successfully
    if (otpSent) {
      navigate("/RegisterRider/page2", { state: formData });
    } else {
      // If OTP failed, reset loading state
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <section>
        <div className="signin">
          <div className="content">
            <h1>Register New Rider</h1>
            <form onSubmit={handleSubmit} className="form">
              {/* Email input */}
              <div className="inputBox">
                <input
                  type="email"
                  required
                  placeholder="E-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Name input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={20}
                />
              </div>

              {/* Phone number input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              {/* Address input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* NIC input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="NIC"
                  value={NIC}
                  onChange={(e) => setNIC(e.target.value)}
                  maxLength={15}
                />
              </div>

              {/* Submit button */}
              <div className="inputBox">
                <input type="submit" value={loading ? "Sending OTP..." : "Continue"} disabled={loading} />
              </div>

              {error && (
                <p className="error" style={{ color: "red", fontSize: "14px" }}>
                  {error}
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisterRider;
