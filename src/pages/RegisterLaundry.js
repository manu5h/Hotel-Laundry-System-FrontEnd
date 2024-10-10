import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const RegisterLaundry = () => {
  const navigate = useNavigate();

  // State for inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [laundry_name, setlaundry_name] = useState("");
  const [phone_number, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [nearest_city, setNearestCity] = useState("");
  const [bank_name, setbank_name] = useState("");
  const [bank_account_number, setbank_account_number] = useState("");
  const [bank_account_holder_name, setbank_account_holder_name] = useState("");
  const [bank_branch, setbank_branch] = useState("");

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
      laundry_name,
      phone_number,
      address,
      nearest_city,
      bank_name,
      bank_account_number,
      bank_account_holder_name,
      bank_branch
    };

    // Set loading state
    setLoading(true);

    // Send OTP
    const otpSent = await sendOtp(formData.email);
    
    // Navigate to the next page if OTP was sent successfully
    if (otpSent) {
      navigate("/register/laundry/page2", { state: formData });
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
      <section style={{height: "100%", margin: "20px 0 20px 0"}}>
        <div className="signin" style={{maxWidth: "40%"}}>
          <div className="content">
            <h1>Register as Laundry</h1>
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

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Laundry Name"
                  value={laundry_name}
                  onChange={(e) => setlaundry_name(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Phone Number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Nearest City"
                  value={nearest_city}
                  onChange={(e) => setNearestCity(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Account number"
                  value={bank_account_number}
                  onChange={(e) => setbank_account_number(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Account holder name"
                  value={bank_account_holder_name}
                  onChange={(e) => setbank_account_holder_name(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Bank"
                  value={bank_name}
                  onChange={(e) => setbank_name(e.target.value)}
                />
              </div>

              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Branch"
                  value={bank_branch}
                  onChange={(e) => setbank_branch(e.target.value)}
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

export default RegisterLaundry;
