import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { FaShoppingCart, FaClock, FaCheckSquare, FaDollarSign } from "react-icons/fa";

const BuyerHome = () => {
  const quickStats = [
    { label: "Total Orders", value: 24, icon: FaShoppingCart, color: "#3b82f6" },
    { label: "Pending Orders", value: 3, icon: FaClock, color: "#f59e0b" },
    { label: "Completed Orders", value: 18, icon: FaCheckSquare, color: "#10b981" },
    { label: "Total Spent", value: "৳82,400", icon: FaDollarSign, color: "#8b5cf6" },
  ];

  const orderStatusData = [
    { name: "Pending", value: 3, color: "#f59e0b" },
    { name: "Processing", value: 3, color: "#3b82f6" },
    { name: "Delivered", value: 18, color: "#10b981" },
  ];

  const spendingTrend = [
    { month: "Jan", amount: 8200 },
    { month: "Feb", amount: 9400 },
    { month: "Mar", amount: 7600 },
    { month: "Apr", amount: 11200 },
    { month: "May", amount: 9800 },
    { month: "Jun", amount: 12300 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-base-content/70">{stat.label}</p>
                  <p className="text-2xl font-bold" style={{ color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
                <stat.icon className="text-2xl" style={{ color: stat.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">Spending Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={spendingTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `৳${value}`} />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.35}
                  name="Amount"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">Order Status</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={orderStatusData}
                  cx="50%"
                  cy="50%"
                  label
                  dataKey="value"
                  nameKey="name"
                  outerRadius={90}
                >
                  {orderStatusData.map((entry, index) => (
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

export default BuyerHome;

