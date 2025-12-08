import React from "react";

import { Navigate, useLocation } from "react-router";
import useAuth from "../hooks/useAuth";
import Loading from "../Components/atoms/Loading";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate state={location.pathname} to="/login"></Navigate>;
  }

  return children;
};

export default PrivateRoute;
