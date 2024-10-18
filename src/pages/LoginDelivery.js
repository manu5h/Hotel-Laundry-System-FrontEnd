import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const LoginDelivery = () => {
  const navigate = useNavigate();

  // State for inputs
  const [email, setEmail] = useState("");

  // State for handling errors and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission and navigate to the next page
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error
    setError("");

    const formData = {
        email,
    };

    // Log to see how many times this function is called
    console.log("Submit triggered");

    // Prevent further execution if already loading
    if (loading) return;

    try {
        // Set loading state
        setLoading(true);

        // Send the POST request to the appropriate API endpoint based on role
        const response = await fetch(API_ENDPOINT.LOGIN_DELIVERY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            // If login is successful, store the token and navigate to the delivery dashboard
            localStorage.setItem("token", data.token);
            navigate("/login/Delivery/page2", { state: formData }); // Redirect to the delivery dashboard
            console.log("Valid email, token received.");
        } else {
            // If login fails, show an error message
            setError(data.message || "Login failed, please try again.");
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
            <h1>Login as Delivery</h1>
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

export default LoginDelivery;
