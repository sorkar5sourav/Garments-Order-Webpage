import React from "react";
import useRole from "../../hooks/useRole";

import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";
import Loading from "../../Components/atoms/Loading";

const DashboardHome = () => {
  const { role, roleLoading } = useRole();
  if (roleLoading) {
    return <Loading></Loading>;
  }
  if (role === "admin") {
    return <AdminDashboard />;
  } else {
    return <UserDashboard />;
  }
};

export default DashboardHome;
