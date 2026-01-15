import React from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";

const ManagerHome = () => {
  const axiosSecure = useAxiosSecure();

  const { data: overviewData, isLoading } = useQuery({
    queryKey: ["manager-overview"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/manager/overview");
      return res.data;
    },
  });

  const stats = overviewData || {
    counts: {
      productsManaged: 0,
      pendingOrders: 0,
      approvedOrders: 0,
      lowStockItems: 0,
    },
    weeklyApprovals: [],
    stockHealth: [],
  };

  const inventoryStats = [
    {
      label: "Products Managed",
      value: stats.counts.productsManaged,
      color: "#10b981",
    },
    {
      label: "Pending Orders",
      value: stats.counts.pendingOrders,
      color: "#f59e0b",
    },
    {
      label: "Approved Orders",
      value: stats.counts.approvedOrders,
      color: "#3b82f6",
    },
    {
      label: "Low Stock Items",
      value: stats.counts.lowStockItems,
      color: "#ef4444",
    },
  ];

  const stockHealth = stats.stockHealth.length > 0
    ? stats.stockHealth
    : [
        { name: "Jan", stock: 0, backorder: 0 },
        { name: "Feb", stock: 0, backorder: 0 },
        { name: "Mar", stock: 0, backorder: 0 },
        { name: "Apr", stock: 0, backorder: 0 },
        { name: "May", stock: 0, backorder: 0 },
        { name: "Jun", stock: 0, backorder: 0 },
      ];

  const approvalTrend = stats.weeklyApprovals.length > 0
    ? stats.weeklyApprovals
    : [
        { name: "Week 1", approvals: 0 },
        { name: "Week 2", approvals: 0 },
        { name: "Week 3", approvals: 0 },
        { name: "Week 4", approvals: 0 },
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
        {inventoryStats.map((stat) => (
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
            <h3 className="card-title text-lg">Stock Health</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={stockHealth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.35}
                  name="In Stock (%)"
                />
                <Area
                  type="monotone"
                  dataKey="backorder"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.25}
                  name="Backorder (%)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">Weekly Approvals</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={approvalTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="approvals" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;

