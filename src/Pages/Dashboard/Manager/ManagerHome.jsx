import React from "react";
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
  const inventoryStats = [
    { label: "Products Managed", value: 142, color: "#10b981" },
    { label: "Pending Orders", value: 58, color: "#f59e0b" },
    { label: "Approved Orders", value: 312, color: "#3b82f6" },
    { label: "Low Stock Items", value: 12, color: "#ef4444" },
  ];

  const stockHealth = [
    { name: "Jan", stock: 92, backorder: 4 },
    { name: "Feb", stock: 96, backorder: 3 },
    { name: "Mar", stock: 88, backorder: 6 },
    { name: "Apr", stock: 90, backorder: 5 },
    { name: "May", stock: 94, backorder: 3 },
    { name: "Jun", stock: 97, backorder: 2 },
  ];

  const approvalTrend = [
    { name: "Week 1", approvals: 42 },
    { name: "Week 2", approvals: 55 },
    { name: "Week 3", approvals: 61 },
    { name: "Week 4", approvals: 68 },
  ];

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

