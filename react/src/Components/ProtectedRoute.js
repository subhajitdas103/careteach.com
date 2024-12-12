import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  console.log("isAuthenticated:", localStorage.getItem('authToken'));
  const isAuthenticated = localStorage.getItem('authToken');
  // const isAuthenticated = !!localStorage.getItem('authToken'); // Safely convert to boolean
 // Example: Check if an auth token exists
  console.log(isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirect to login if not authenticated
  }

  return children; // Render the protected route if authenticated


  
};

export default ProtectedRoute;
