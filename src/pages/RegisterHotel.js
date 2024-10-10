import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const RegisterHotel = () => {
  const navigate = useNavigate();

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [hotel_name, setHotelName] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nearest_city, setNearestCity] = useState("");

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

    // Password validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    const phoneRegex = /^0\d{9}$/; 
    if (!phoneRegex.test(phone_number)) {
      setError("Phone number must start with 0 and be exactly 10 digits.");
      return;
    }

    const formData = {
      email,
      password,
      hotel_name,
      phone_number,
      address,
      nearest_city,
    };

    // Set loading state
    setLoading(true);

    // Send OTP
    const otpSent = await sendOtp(formData.email);
    
    // Navigate to the next page if OTP was sent successfully
    if (otpSent) {
      navigate("/register/hotel/page2", { state: formData });
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
            <h1>Register as Hotel</h1>
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

              {/* Password inputs */}
              <div className="inputBox">
                <input
                  type="password"
                  required
                  placeholder="Password (must be at least 8 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </div>

              {/* Hotel name input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Hotel Name"
                  value={hotel_name}
                  onChange={(e) => setHotelName(e.target.value)}
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

              {/* Nearest city input */}
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Nearest City"
                  value={nearest_city}
                  onChange={(e) => setNearestCity(e.target.value)}
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

export default RegisterHotel;
