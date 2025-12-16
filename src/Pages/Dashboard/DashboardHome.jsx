import React from "react";
import useRole from "../../hooks/useRole";
import Loading from "../../Components/atoms/Loading";
import usePageTitle from "../../hooks/usePageTitle";
import AdminHome from "./Admin/AdminHome";
import ManagerHome from "./Manager/ManagerHome";
import BuyerHome from "./Buyer/BuyerHome";

const DashboardHome = () => {
  usePageTitle("Dashboard - Garments Order");

  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading />;
  }

  if (role === "admin") {
    return <AdminHome />;
  }

  if (role === "manager") {
    return <ManagerHome />;
  }

  if (role === "buyer") {
    return <BuyerHome />;
  }

  return (
    <div className="p-6">
      <div className="max-w-xl mx-auto text-center space-y-3">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-base-content/70">
          Your account is being set up. Please contact an administrator for access.
        </p>
      </div>
    </div>
  );
};

export default DashboardHome;