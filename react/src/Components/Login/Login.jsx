import React, { useState, useEffect } from "react";
import axios from "axios";
import "./style.css";
import logo from "../../Assets/logo.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, Link } from "react-router-dom";
import { Checkbox } from "@material-tailwind/react";
import Spinner from 'react-bootstrap/Spinner';
const Login = () => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const isTokenValid = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && isTokenValid(token)) {
      navigate("/dashboard");
    } else {
      localStorage.removeItem("authToken");
    }

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${backendUrl}/api/login`, 
        { email, password },
        { withCredentials: true }
      );

      if (response.data.status === "success") {
        const { token,roll_name , roll_id} = response.data;
        localStorage.setItem("authToken", token);
        localStorage.setItem("authRollName",roll_name );
        localStorage.setItem("roll_id",roll_id );
        console.log(response.data);
        setSuccess("Login successful!");
        navigate("/Dashboard");

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_body">
      <main className="form-signin w-100 m-auto">
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-md-6 text-center">
            <img className="Klogo-image" src={logo} alt="Logo" />
            <h2 className="text-under">Care Teach</h2>
          </div>
          <div className="col-12 col-md-6 user-loginarea">
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
              <div className="checkbox mb-3 d-flex justify-content-between">
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
             
              <button
                className="w-100 btn btn-lg log-in-btn"
                type="submit"
                disabled={loading}
              >
                {loading ? "" : "Login"}
                {loading && (
                  <Spinner animation="border" role="status">
                        
                  </Spinner>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
