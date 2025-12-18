import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAdmin, component: Component }) => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  // Check user role
  const role = user && user.role;

  // While loading, you can return null or a spinner
  if (loading) return null;

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If admin route is required but user is not admin
  if (isAdmin && role !== "admin") {
    return <Navigate to="/" />;
  }

  return <Component />;
};

export default ProtectedRoute;
