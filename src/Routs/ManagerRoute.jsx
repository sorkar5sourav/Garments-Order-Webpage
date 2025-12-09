import React from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../Components/atoms/Loading";
import useAuth from "../hooks/useAuth";
import useRole from "../hooks/useRole";

const ManagerRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useRole();
  const location = useLocation();

  if (loading || roleLoading) {
    return <Loading />;
  }

  if (!user || role !== "manager") {
    return <Navigate to="/" state={location.pathname} replace />;
  }

  return children;
};

export default ManagerRoute;

