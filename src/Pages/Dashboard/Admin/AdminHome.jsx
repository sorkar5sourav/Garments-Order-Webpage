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

  const rangeStart = useMemo(() => {
    const now = new Date();
    if (filter === "today") {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      return start;
    }
    if (filter === "7days") {
      const d = new Date();
      d.setDate(d.getDate() - 6);
      d.setHours(0, 0, 0, 0);
      return d;
    }
    // 30 days
    const d = new Date();
    d.setDate(d.getDate() - 29);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [filter]);

  const { data: products = [] } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products", { params: { limit: 2000 } });
      return res.data.products || [];
    },
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders");
      return res.data || [];
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data || [];
    },
  });

  // Derived stats
  const stats = useMemo(() => {
    const start = rangeStart;
    const productsInRange = products.filter((p) => p.createdAt && new Date(p.createdAt) >= start).length;
    const totalProducts = products.length;

    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const ordersThisMonth = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= thisMonthStart).length;
    const ordersInRange = orders.filter((o) => o.createdAt && new Date(o.createdAt) >= start).length;

    const usersNew = users.filter((u) => u.createdAt && new Date(u.createdAt) >= start).length;
    const usersTotal = users.length;

    const managersActive = users.filter((u) => u.role === "manager" && u.status === "active").length;

    // role distribution for pie
    const roleDistributionMap = users.reduce((acc, u) => {
      const r = u.role || "buyer";
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});

    const roleDistribution = Object.keys(roleDistributionMap).map((k) => ({ name: k, value: roleDistributionMap[k] }));

    // orders by day for chart
    const days = [];
    const dayCount = filter === "today" ? 1 : filter === "7days" ? 7 : 30;
    for (let i = 0; i < dayCount; i++) {
      const d = new Date(rangeStart);
      d.setDate(rangeStart.getDate() + i);
      const label = `${d.getMonth() + 1}/${d.getDate()}`;
      days.push({ date: d, label, orders: 0 });
    }
    orders.forEach((o) => {
      if (!o.createdAt) return;
      const t = new Date(o.createdAt);
      if (t >= rangeStart) {
        const idx = Math.floor((t - rangeStart) / (24 * 60 * 60 * 1000));
        if (idx >= 0 && idx < days.length) days[idx].orders++;
      }
    });

    return {
      productsInRange,
      totalProducts,
      ordersThisMonth,
      ordersInRange,
      usersNew,
      usersTotal,
      managersActive,
      roleDistribution,
      chartData: days,
    };
  }, [products, orders, users, rangeStart, filter]);

  const colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex gap-2">
          <button className={`btn ${filter === "today" ? "btn-primary" : ""}`} onClick={() => setFilter("today")}>Today</button>
          <button className={`btn ${filter === "7days" ? "btn-primary" : ""}`} onClick={() => setFilter("7days")}>7 Days</button>
          <button className={`btn ${filter === "30days" ? "btn-primary" : ""}`} onClick={() => setFilter("30days")}>30 Days</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Products ({filter})</p>
            <p className="text-2xl font-bold text-green-600">{stats.productsInRange}</p>
            <p className="text-xs text-gray-500">Total: {stats.totalProducts}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Orders (This Month)</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.ordersThisMonth}</p>
            <p className="text-xs text-gray-500">In range: {stats.ordersInRange}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Users (New)</p>
            <p className="text-2xl font-bold text-blue-600">{stats.usersNew}</p>
            <p className="text-xs text-gray-500">Total: {stats.usersTotal}</p>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <p className="text-sm text-base-content/70">Managers (Active)</p>
            <p className="text-2xl font-bold text-teal-600">{stats.managersActive}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h3 className="card-title text-lg">Orders Trend</h3>
              <div className="flex items-center gap-2">
                <select className="select select-sm" value={chartType} onChange={(e) => setChartType(e.target.value)}>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              {chartType === "bar" ? (
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              ) : (
                <BarChart data={stats.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="orders" fill="#3b82f6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title text-lg">User Roles</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stats.roleDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
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

