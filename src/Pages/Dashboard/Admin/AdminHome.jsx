import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const AdminHome = () => {
  const systemStats = [
    { label: "Users", value: 1240, color: "#3b82f6" },
    { label: "Products", value: 860, color: "#10b981" },
    { label: "Orders", value: 3420, color: "#f59e0b" },
    { label: "Revenue", value: "৳4.2M", color: "#8b5cf6" },
  ];

  const roleDistribution = [
    { name: "Admin", value: 12, color: "#3b82f6" },
    { name: "Manager", value: 34, color: "#10b981" },
    { name: "Buyer", value: 1194, color: "#f59e0b" },
  ];

  const monthlyOrders = [
    { month: "Jan", orders: 260 },
    { month: "Feb", orders: 320 },
    { month: "Mar", orders: 410 },
    { month: "Apr", orders: 380 },
    { month: "May", orders: 450 },
    { month: "Jun", orders: 520 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemStats.map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <p className="text-sm text-base-content/70">{stat.label}</p>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">Monthly Orders</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">User Roles</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;

