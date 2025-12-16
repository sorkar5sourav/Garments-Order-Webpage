import React from "react";
import useRole from "../../hooks/useRole";
import Loading from "../../Components/atoms/Loading";
import usePageTitle from "../../hooks/usePageTitle";

const DashboardHome = () => {
  usePageTitle("Dashboard - Garments Order");

  const { role, roleLoading } = useRole();

  if (roleLoading) {
    return <Loading />;
  }

  const getDashboardContent = () => {
    switch (role) {
      case "admin":
        return {
          title: "Admin Dashboard",
          description: "Manage users, products, and orders",
          features: ["Manage Users", "All Products", "All Orders"]
        };
      case "manager":
        return {
          title: "Manager Dashboard",
          description: "Add products, manage inventory, and approve orders",
          features: ["Add Product", "Manage Products", "Pending Orders", "Approve Orders", "My Profile"]
        };
      case "buyer":
        return {
          title: "Buyer Dashboard",
          description: "Track your orders and manage your profile",
          features: ["My Orders", "Track Order", "My Profile"]
        };
      default:
        return {
          title: "Dashboard",
          description: "Welcome to Garments Order",
          features: []
        };
    }
  };

  const content = getDashboardContent();

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">{content.title}</h1>
        <p className="text-lg text-center text-base-CONTENT mb-8">{content.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.features.map((feature, index) => (
            <div key={index} className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h2 className="card-title">{feature}</h2>
                <p>Access and manage {feature.toLowerCase()}</p>
              </div>
            </div>
          ))}
        </div>

        {content.features.length === 0 && (
          <div className="text-center">
            <p className="text-gray-500">Your account is pending approval. Please contact an administrator.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
