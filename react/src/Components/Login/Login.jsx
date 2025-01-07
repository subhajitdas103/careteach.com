import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in by calling the backend API
    axios
      .get("/api/user", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Pass the stored token
        },
        withCredentials: true, // Include credentials for session-based auth (if necessary)
      })
      .then((response) => {
        console.log("User session data:", response); // Logging user session data
        // If the user is authenticated, redirect to the dashboard
        navigate("/dashboard");
      })
      .catch((error) => {
        console.error("Error checking session:", error); // Log error if any
        // If not authenticated, stay on the login page
      });
  }, [navigate]);
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); // Loading state

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    setSuccess(""); // Clear success message
    setLoading(true); // Set loading to true

    try {
      const response = await axios.post(
        "/api/login",
        { email, password },
        { withCredentials: true } // Send credentials to maintain session
      );

      if (response.data.status === "success") {
        setSuccess("Login successful!");
        localStorage.setItem("authToken", response.data.token);  // Store token in localStorage
        navigate("/dashboard");  // Redirect to dashboard
      } else {
        setError(response.data.message || "Login failed. Try again.");
      }
      
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false); // Set loading to false after the request is completed
    }
  };

  return (
    <div className="login_body">
      <main className="form-signin w-100 m-auto">
        <div className="col-md-12 d-flex log-in-area">
          {/* Left Section */}
          <div className="col-md-6">
            <img className="Klogo-image" src={logo} alt="Logo" />
            <h2 className="text-under">Care Teach</h2>
          </div>

          {/* Right Section */}
          <div className="col-md-6 user-loginarea">
            <form onSubmit={handleLogin}>
              <h1 className="h3 mb-3 fw-normal">User login</h1>
              <p>Hey, enter your details to login</p>
              {/* Email Input */}
              <div className="mb-3">
                <input
                  type="email"
                  className="form-control input-box"
                  id="floatingInput"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label className="pass" htmlFor="floatingInput">
                  Email address
                </label>
              </div>
              {/* Password Input */}
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control input-box"
                  id="floatingPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label className="pass" htmlFor="floatingPassword">
                  Password
                </label>
              </div>
              {/* Error or Success Messages */}
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {/* Loading Spinner */}
              {loading && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              {/* Login Button */}
              <button className="w-100 btn btn-lg log-in-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"} {/* Change button text when loading */}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
