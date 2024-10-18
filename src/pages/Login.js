import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/Login.css";
import logo from "../assets/images/logo.png";
import { API_ENDPOINT } from "../config";

const Login = () => {
  const { role } = useParams();
  const navigate = useNavigate();

  // State for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for handling errors
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    // Create the login payload
    const payload = {
      email,
      password,
    };

    // Set the API URL dynamically based on the role
    let apiUrl = "";

    if (role === "Hotel") {
      apiUrl = API_ENDPOINT.LOGIN_HOTEL;
    } else if (role === "Laundry") {
      apiUrl = API_ENDPOINT.LOGIN_LAUNDRY;
    }

    try {
      // Send the POST request to the appropriate API endpoint based on role
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // If login is successful, store the token and navigate to the respective dashboard
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", role);
        localStorage.setItem("userID", data.result.id);

        navigate(`/${role}/dashboard`, {
          replace: true,
        });

        console.log("login successful");
      } else {
        // If login fails, show an error message
        setError(data.message || "Login failed, please try again.");
      }
    } catch (error) {
      // Handle any network or other errors
      setError("An error occurred, please try again later.");
    }
  };

  const handleNavigation = (role) => {
    navigate(`/register/${role}`);
  };

  return (
    <div>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <section>
        <div className="signin">
          <div className="content">
            <h1>{`Login as ${role}`}</h1>
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

              <div className="inputBox">
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="links">
                <a href="#">Forgot Password?</a>
              </div>

              {/* Submit button */}
              <div className="inputBox">
                <input type="submit" value="Login" />
              </div>

              {error && (
                <p className="error" style={{ color: "red", fontSize: "14px" }}>
                  {error}!
                </p>
              )}

              {/* Signup Link */}
              <div className="links">
                <p>Don't have an account?</p>
                <div className="options"></div>
                <a href="" onClick={() => handleNavigation(role)}>
                  Register here{" "}
                </a>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
