import React from 'react';
import './Navbar.css'; // Optional: Add custom styles
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from "../../assets/logo.png"; // Import the logo
import logoutGif from "../../assets/icons8-logout.png"; 
import { toast, ToastContainer } from 'react-toastify';
// ../../assets/logo.png
import useAuth from "../../hooks/useAuth";
const Navbar = () => {
  const { setUserRollID, setUserRollName } = useAuth(); 
  const handleLogout = () => {
    // LocalStorage.removeItem('authToken');
    // LocalStorage.clear(); 
    setUserRollID(null);
    setUserRollName(null);
  
    // // Display toast notification instead of an alert
    // toast.success("You have been logged out successfully!", {
    //   position: "top-right", 
    //   autoClose:1100 ,
    //   className: "toast_message_logout",
    // });
  
    setTimeout(() => {
      window.location.href = '/';
    }, 1800);
  };
  
  

  return (
      <header>
        <ToastContainer />
          <div className="top_nav nav-hidden-print">
              <div className="row nav_menu " style={{ height: '60px' }}>
                  <div className="navbar nav_title" style={{ border: 0 }}>
                      <div className="nav-title-logo">
                        <a href="/Dashboard">
                          <img src={logo} alt="Logo" className="header-logo" />
                        </a>
                          <h2>CARE TEACH</h2>
                      </div>
                      <div 
                          className="logout" style={{marginTop: '-21px'}}
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
