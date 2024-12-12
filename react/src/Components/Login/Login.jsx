import React, { useState ,useEffect } from "react";
import axios from "axios";
import "./style.css";
import kgroup from "../../Assets/kgroup.png";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// import ProtectedRoute from "./Components/ProtectedRoute";
const Login = () => {
  const navigate = useNavigate(); // For Redirect use react hooks (useNavigate)
  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    // console.log(authToken);
    if (authToken) {
      navigate("/dashboard"); // Redirect if already logged in
    }else{
      navigate("/"); 
    }
  }, []);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        email,
        password,
      });
// console.response(responce);
      if (response.data.status === "success") {
        setSuccess("Login successful!");
        setError("");
        // Save the token in localStorage or context
        localStorage.setItem("authToken", response.data.token);
        navigate("/dashboard"); // Redirect to the dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");

      setSuccess("");
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
                />
                <label className="pass" htmlFor="floatingPassword">
                  Password
                </label>
              </div>
              {/* Error Message */}
              {error && <p className="text-danger">{error}</p>}
              {success && <p className="text-success">{success}</p>}
              {/* Login Button */}
              <button
                className="w-100 btn btn-lg log-in-btn"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
