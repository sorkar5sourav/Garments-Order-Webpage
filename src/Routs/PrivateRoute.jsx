import React from "react";

import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/atoms/Loading";

// Helper function to get token from cookie
const getTokenFromCookie = () => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="));
  return cookieValue ? cookieValue.split("=")[1] : null;
};

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  // Check if user is authenticated and has valid token
  const token = getTokenFromCookie();
  if (!user || !token) {
    return <Navigate to="/login" state={{ pathname: location.pathname }} />;
  }

  return children;
};

export default PrivateRoute;
