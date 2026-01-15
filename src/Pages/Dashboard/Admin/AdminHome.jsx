import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
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
  const axiosSecure = useAxiosSecure();
  const [filter, setFilter] = useState("7days"); // today | 7days | 30days
  const [chartType, setChartType] = useState("bar");

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["admin-overview", filter],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin/overview", {
        params: { period: filter },
      });
      return res.data;
    },
  });

  const stats = overviewData || {
    counts: {
      totalProducts: 0,
      productsInRange: 0,
      totalOrders: 0,
      ordersInRange: 0,
      ordersThisMonth: 0,
      totalUsers: 0,
      usersInRange: 0,
      activeManagers: 0,
    },
    roleDistribution: [],
    timeSeries: [],
  };

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${filter === "today" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("today")}
          >
            Today
          </button>
          <button
            className={`btn btn-sm ${filter === "7days" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("7days")}
          >
            7 Days
          </button>
          <button
            className={`btn btn-sm ${filter === "30days" ? "btn-primary" : "btn-outline"}`}
            onClick={() => setFilter("30days")}
          >
            30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Products ({filter})</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.counts.productsInRange}
            </p>
            <p className="text-xs text-gray-500">Total: {stats.counts.totalProducts}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Orders (This Month)</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.counts.ordersThisMonth}
            </p>
            <p className="text-xs text-gray-500">In range: {stats.counts.ordersInRange}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Users (New)</p>
            <p className="text-2xl font-bold text-blue-600">
              {stats.counts.usersInRange}
            </p>
            <p className="text-xs text-gray-500">Total: {stats.counts.totalUsers}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Managers (Active)</p>
            <p className="text-2xl font-bold text-teal-600">
              {stats.counts.activeManagers}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-lg">Orders Trend</h3>
              <div className="flex items-center gap-2">
                <select
                  className="select select-sm"
                  value={chartType}
                  onChange={(e) => setChartType(e.target.value)}
                >
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.timeSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#3b82f6" />
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
                  data={stats.roleDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {stats.roleDistribution.map((entry, index) => (
                    <Cell key={index} fill={colors[index % colors.length]} />
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

