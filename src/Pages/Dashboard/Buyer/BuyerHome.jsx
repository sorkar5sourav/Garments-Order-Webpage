import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
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
  const axiosSecure = useAxiosSecure();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["buyer-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/buyer/overview");
      return res.data;
    },
  });

  const stats = overviewData || {
    counts: {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      totalSpent: 0,
    },
    orderStatusData: [],
    spendingTrend: [],
  };

  const quickStats = [
    {
      label: "Total Orders",
      value: stats.counts.totalOrders,
      icon: FaShoppingCart,
      color: "#3b82f6",
    },
    {
      label: "Pending Orders",
      value: stats.counts.pendingOrders,
      icon: FaClock,
      color: "#f59e0b",
    },
    {
      label: "Completed Orders",
      value: stats.counts.completedOrders,
      icon: FaCheckSquare,
      color: "#10b981",
    },
    {
      label: "Total Spent",
      value: `৳${stats.counts.totalSpent.toLocaleString()}`,
      icon: FaDollarSign,
      color: "#8b5cf6",
    },
  ];

  const orderStatusData = stats.orderStatusData.length > 0
    ? stats.orderStatusData.map((item) => ({
        name: item.name,
        value: item.value,
        color:
          item.name.toLowerCase() === "pending"
            ? "#f59e0b"
            : item.name.toLowerCase() === "delivered"
            ? "#10b981"
            : "#3b82f6",
      }))
    : [
        { name: "Pending", value: 0, color: "#f59e0b" },
        { name: "Processing", value: 0, color: "#3b82f6" },
        { name: "Delivered", value: 0, color: "#10b981" },
      ];

  const spendingTrend = stats.spendingTrend.length > 0
    ? stats.spendingTrend
    : [
        { month: "Jan", amount: 0 },
        { month: "Feb", amount: 0 },
        { month: "Mar", amount: 0 },
        { month: "Apr", amount: 0 },
        { month: "May", amount: 0 },
        { month: "Jun", amount: 0 },
      ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

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

