import React from 'react';
import './Navbar.css'; // Optional: Add custom styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../assets/logo.png"; // Import the logo
// ../../assets/logo.png

const Navbar = () => {
  const handleLogout = () => {
      // Clear user session or authentication tokens
      localStorage.removeItem('authToken'); // Example for clearing token
      sessionStorage.clear(); // Clear all session data
      alert('You have been logged out.');

      // Redirect to login page (adjust the route as needed)
      window.location.href = '/';
  };

  return (
      <header>
          <div className="top_nav nav-hidden-print">
              <div className="row nav_menu">
                  <div className="navbar nav_title" style={{ border: 0 }}>
                      <div className="nav-title-logo">
                        <a href="/">
                          <img src={logo} alt="Logo" className="header-logo" />
                        </a>
                          <h2>CARE TEACH</h2>
                      </div>
                      <div 
                          className="logout" 
                          id="dashboard_logout" 
                          onClick={handleLogout}
                      >
                          Logout <i className="fa fa-sign-out fa-1x"></i>
                      </div>
                  </div>
              </div>
          </div>
      </header>
  );
};

export default Navbar;
