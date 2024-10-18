import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const ResetPassword = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  // State for inputs
  const [email, setEmail] = useState("");

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
      if (response.status === 200) {
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

    const formData = {
      email,
      role, 
    };

    try {
      // Set loading state
      setLoading(true);

      // Send the POST request to the appropriate API endpoint based on role
      const response = await fetch(API_ENDPOINT.CHECK_EMAIL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send formData (email and role)
      });

      const data = await response.json();

      if (response.status === 200) {
        sendOtp(email);

        // Navigate to the next page with email and role in state
        navigate(`/resetPassword/${role}/page2`, { state: formData });
        console.log("Valid email");
      } else {
        // If email check fails, show an error message
        setError(data.message || "Email check failed, please try again.");
      }
    } catch (error) {
      // Handle any network or other errors
      setError("An error occurred, please try again later.");
    } finally {
      // Reset loading state
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
            <h1>Reset Password - {role}</h1>
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

              {/* Submit button */}
              <div className="inputBox">
                <input
                  type="submit"
                  value={loading ? "Sending OTP..." : "Continue"}
                  disabled={loading}
                />
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

export default ResetPassword;