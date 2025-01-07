import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate , Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

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

    // If "Remember me" is checked, load credentials from localStorage
    const storedEmail = localStorage.getItem("email");
    const storedPassword = localStorage.getItem("password");
    if (storedEmail && storedPassword) {
      setEmail(storedEmail);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, [navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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

        // If "Remember me" is checked, store credentials in localStorage
        if (rememberMe) {
          localStorage.setItem("email", email);
          localStorage.setItem("password", password);
        } else {
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }
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
              <div className="checkbox mb-3 d-flex space-between">
                <label>
                  Remember me
                  <input
                    type="checkbox"
                    className="rememberMeButton"
                    value="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                </label>
                <p className="text-right">
                <Link to="/forgot-password">Forgot password?</Link>
                </p>
              </div>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {loading && (
               
               <BeatLoader color="#2673da" />
              )}
              <button
                className="w-100 btn btn-lg log-in-btn"
                type="submit"
                disabled={loading}
              >
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
