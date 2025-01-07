import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if the user is authenticated (replace with your actual logic)
  const isAuthenticated = localStorage.getItem('authToken'); // Example logic

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" />;
  }

  // Render the protected route if authenticated
  return children;
};

export default ProtectedRoute;
