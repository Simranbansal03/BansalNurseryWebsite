import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext"; // Adjust path as needed

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    // While checking auth state, show a loading indicator or nothing
    // This prevents a flash of the login page or protected content
    return (
      <div className="page-container">
        <p>Authenticating...</p>
      </div>
    ); // Or return null, or a spinner component
  }

  if (!currentUser) {
    // User not logged in, redirect to login page
    // Pass the current location so we can redirect back after login
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children; // User is logged in, render the requested component
};

export default ProtectedRoute;
