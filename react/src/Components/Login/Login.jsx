import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  // Token validation function
  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // Check if the token is valid and navigate to dashboard if valid
  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      navigate("/dashboard");
    } else {
      sessionStorage.removeItem("authToken");
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the login process
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `/api/login`, // API endpoint
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        const token = response.data.token;
        console.log("Received token:", token);

        sessionStorage.setItem("authToken", token);

        setSuccess("Login successful!");
        navigate("/Dashboard");
      } else {
        setError(response.data.message || "Login failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_body">
      <main className="form-signin w-100 m-auto">
        <div className="col-md-12 d-flex log-in-area">
          <div className="col-md-6">
            <img className="Klogo-image" src={logo} alt="Logo" />
            <h2 className="text-under">Care Teach</h2>
          </div>
          <div className="col-md-6 user-loginarea">
            <form onSubmit={handleLogin}>
              <h1 className="h3 mb-3 fw-normal">User login</h1>
              <p>Hey, enter your details to login</p>
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
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {loading && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              <button className="w-100 btn btn-lg log-in-btn" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
