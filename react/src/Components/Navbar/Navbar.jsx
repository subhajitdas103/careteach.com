import React from 'react';
import './Navbar.css'; // Optional: Add custom styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../assets/logo.png"; // Import the logo
import logoutGif from "../../assets/icons8-logout.png"; 
// ../../assets/logo.png
import useAuth from "../../hooks/useAuth";
const Navbar = () => {
  const handleLogout = () => {
    const { setUserRollID, setUserRollName } = useAuth(); 
      LocalStorage.removeItem('authToken');
      LocalStorage.clear(); 
      setUserRollID(null);
      setUserRollName(null);
      alert('You have been logged out.');

      // Redirect to login page (adjust the route as needed)
      window.location.href = '/';
  };

  return (
      <header>
          <div className="top_nav nav-hidden-print">
              <div className="row nav_menu " style={{ height: '74px' }}>
                  <div className="navbar nav_title" style={{ border: 0 }}>
                      <div className="nav-title-logo">
                        <a href="/Dashboard">
                          <img src={logo} alt="Logo" className="header-logo" />
                        </a>
                          <h2>CARE TEACH</h2>
                      </div>
                      <div 
                          className="logout" style={{marginTop: '-15px'}}
                          id="dashboard_logout" 
                          onClick={handleLogout}
                      >
                        Logout 
                        <img src={logoutGif} alt="Logout" className="icons8-logout" />
                          
                      </div>
                  </div>
              </div>
          </div>

          
      </header>
  );
};

export default Navbar;
