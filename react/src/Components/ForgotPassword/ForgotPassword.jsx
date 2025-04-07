import React, { useState } from "react";
import axios from "axios";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import './ForgotPasswordCSS.css'; // Optional: Add custom styles
const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle the forgot password process
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      // Replace this URL with your API endpoint for password reset
      const response = await axios.post("/api/forgot-password", { email });

      if (response.data.success) {
        setSuccess("Password reset link sent to your email.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_body">
      <main className="form-signin w-100 m-auto">
        <div className="row log-in-area">
          <div className=" col-12 col-md-6">
            <img className="Klogo-image" src={logo} alt="Logo" />
            <h2 className="text-under">Care Teach</h2>
          </div>
          <div className="col-12 col-md-6 user-loginarea">
            <form onSubmit={handleForgotPassword}>
              <h1 className="h3 mb-3 fw-normal">Forgot Password</h1>
              <p>Enter your email address to receive a password reset link.</p>
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
              
                </label>
              </div>
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {loading && (
                <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
                </div>
              )}
              <button
                className="w-100 btn btn-lg log-in-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
