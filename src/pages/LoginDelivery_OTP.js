import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";
import "../styles/OTP_Page.css";

const LoginDelivery_OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Extract form data from the previous page
  const formData = location.state;

  // State for OTP, error, countdown, and visibility of the resend button
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120); // 120 seconds countdown
  const [showResend, setShowResend] = useState(false); // Control visibility of the resend button
  const [timerId, setTimerId] = useState(null); // State to hold the timer ID

  useEffect(() => {
    // Automatically send OTP on component mount
    sendOtp();

    // Start the countdown after sending OTP
    startCountdown();

    // Cleanup the timer on unmount
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, []); // Run only once on mount

  // Function to start the countdown timer
  const startCountdown = () => {
    setShowResend(false); // Hide the resend button initially
    setCountdown(120); // Reset countdown

    // Clear any existing timer to avoid multiple timers
    if (timerId) {
      clearInterval(timerId);
    }

    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setShowResend(true); // Show the resend button after countdown ends
          return 0;
        }
        return prev - 1; // Decrease countdown by 1
      });
    }, 1000); // 1 second intervals

    setTimerId(id); // Save the timer ID
  };

  // Function to send OTP (used for both auto-send and resend)
  const sendOtp = async () => {
    try {
      const response = await fetch(API_ENDPOINT.SEND_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const result = await response.json();
      if (response.status === 200) {
        console.log("OTP sent successfully!");
        setError(""); // Clear any previous error messages
      } else {
        console.error("Failed to send OTP:", result.error);
        setError("Failed to send OTP, please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending the OTP.");
    }
  };

  // Function to verify OTP
  const verifyOtp = async (otp) => {
    try {
      const response = await fetch(API_ENDPOINT.VERIFY_OTP, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const result = await response.json();
      if (response.status === 200) {
        console.log("OTP verified successfully!");
        return true;
      } else if (response.status === 400) {
        setError("Incorrect OTP !");
        return false;
      } else {
        setError(result.error || "Failed to verify OTP");
        return false;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred during OTP verification.");
      return false;
    }
  };

  // Function to handle form submission and verify OTP
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    const otpVerified = await verifyOtp(otp);
    if (otpVerified) {
      navigate("/Hotel/dashboard");
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
            <h4>Enter the OTP sent to your email.</h4>
            <form onSubmit={handleSubmit} className="form">
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>

              {/* Countdown Display */}
              <div className="countdown">
                {countdown > 0 ? (
                  <p className="resend-countdown">
                    Resend in {countdown} seconds
                  </p>
                ) : (
                  showResend && (
                    <div className="resend-otp">
                      <input
                        type="button"
                        value="Resend OTP"
                        onClick={sendOtp} // Use sendOtp for resending OTP
                      />
                    </div>
                  )
                )}
              </div>

              <div className="inputBox">
                <input type="submit" value="Register" />
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

export default LoginDelivery_OTP;
