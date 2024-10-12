import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";
import "../styles/OTP_Page.css";

const ResetPassword_OTP = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [newPassword, setnewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Extract form data from the previous page
  const formData = location.state;

  // State for OTP, error, and countdown timer
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(120);
  const [showResend, setShowResend] = useState(false);
  const timerId = useRef(null); // useRef for timer ID

  useEffect(() => {
    startCountdown(); // Start countdown when the component mounts

    return () => {
      // Cleanup timer on component unmount
      if (timerId.current) {
        clearInterval(timerId.current);
      }
    };
  }, []); // Run only once on mount

  const startCountdown = () => {
    setShowResend(false); // Hide the resend button
    setCountdown(120); // Reset the countdown

    if (timerId.current) {
      clearInterval(timerId.current); // Clear any existing timer
    }

    timerId.current = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          clearInterval(timerId.current); // Stop the timer
          setShowResend(true); // Show the resend button
          return 0; // Countdown reaches 0
        }
        return prevCountdown - 1; // Decrease the countdown
      });
    }, 1000); // 1 second intervals
  };

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
      } else {
        setError(result.error || "Incorrect OTP");
        return false;
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred during OTP verification.");
      return false;
    }
  };

  const handleResendOtp = async () => {
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
        console.log("OTP resent successfully!");
        setError(""); // Clear error
        startCountdown(); // Restart countdown
      } else {
        setError(result.error || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      setError("An error occurred while resending OTP.");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clear previous error
    setError("");

    // Password validation
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== passwordConfirm) {
      setError("Passwords do not match!");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be exactly 6 digits.");
      return;
    }

    const otpVerified = await verifyOtp(otp);
    if (otpVerified) {
      // Set the API URL dynamically based on the role
      let apiUrl = "";

      if (formData.role === "Hotel") {
        apiUrl = API_ENDPOINT.RESET_PASSWORD_HOTEL;
      } else if (formData.role === "Laundry") {
        apiUrl = API_ENDPOINT.RESET_PASSWORD_LAUNDRY;
      }

      try {
        const response = await fetch(apiUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            newPassword: newPassword,
          }),
        });
        const data = await response.json();

        if (response.ok) {
          alert("Password reset Successfully! Login now!");
          navigate(`/login/${formData.role}`);
          console.log("Password reset successfully!");
        } else {
          setError(data.message || "Password reset failed, please try again.");
        }
      } catch (error) {
        setError("An error occurred during reset password.");
      }
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
            <form onSubmit={handleSubmit} className="form">
              <div className="inputBox">
                <input
                  type="text"
                  required
                  placeholder="Enter the OTP sent to your email."
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
                        onClick={handleResendOtp}
                      />
                    </div>
                  )
                )}

                {/* Password inputs */}
                <div className="inputBox">
                  <input
                    type="password"
                    required
                    placeholder="Password (must be at least 8 characters)"
                    value={newPassword}
                    onChange={(e) => setnewPassword(e.target.value)}
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
              </div>

              <div className="inputBox">
                <input type="submit" value="Reset Password" />
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

export default ResetPassword_OTP;
