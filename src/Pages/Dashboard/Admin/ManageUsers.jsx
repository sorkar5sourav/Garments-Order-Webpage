import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../../Components/atoms/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const {
    data: users = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-users", search, roleFilter, statusFilter],
    queryFn: async () => {
      const params = {};
      if (search) params.search = search;
      if (roleFilter && roleFilter !== "all") params.role = roleFilter;
      if (statusFilter && statusFilter !== "all") params.status = statusFilter;

      const res = await axiosSecure.get("/users", { params });
      return res.data || [];
    },
    keepPreviousData: true,
  });

  const handleUpdateRole = async (user) => {
    const { value: role } = await Swal.fire({
      title: `Update role for ${user.displayName || user.name || "user"}`,
      input: "select",
      inputOptions: {
        admin: "Admin",
        manager: "Manager",
        buyer: "Buyer",
        user: "User",
        suspended: "Suspended",
      },
      inputValue: user.role || "user",
      showCancelButton: true,
      confirmButtonText: "Update",
    });

    if (!role || role === user.role) return;

    await axiosSecure.patch(`/users/${user._id}/role`, { role });
    Swal.fire("Updated!", "User role updated successfully.", "success");
    refetch();
  };

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "suspended" ? "active" : "suspended";
    const confirmed = await Swal.fire({
      title: `Confirm ${
        nextStatus === "suspended" ? "suspension" : "activation"
      }`,
      text: `This will mark the user as ${nextStatus}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed",
    });

    if (!confirmed.isConfirmed) return;

    await axiosSecure.patch(`/users/${user._id}/role`, { status: nextStatus });
    Swal.fire("Updated!", "User status updated successfully.", "success");
    refetch();
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Manage Users</h2>
          <p className="text-sm text-gray-500">
            Add, update roles, or suspend accounts.
          </p>
        </div>
        <div className="badge badge-info badge-outline">
          Total Users: {users.length}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="flex items-center gap-2 w-full md:w-1/2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email"
            className="input input-bordered w-full"
          />
          <button
            onClick={() => refetch()}
            className="btn btn-primary ml-2"
            title="Apply search"
          >
            Search
          </button>
          <button
            onClick={() => {
              setSearch("");
              setRoleFilter("all");
              setStatusFilter("all");
            }}
            className="btn ml-2"
            title="Clear filters"
          >
            Clear
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="buyer">Buyer</option>
            <option value="user">User</option>
            <option value="suspended">Suspended</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select select-bordered"
          >
            <option value="all">All status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="font-semibold">
                  {user.displayName || user.name || "N/A"}
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="badge badge-neutral uppercase">
                    {user.role || "user"}
                  </span>
                </td>
                <td>
                  <span
                    className={`badge ${
                      user.status === "suspended"
                        ? "badge-error"
                        : "badge-success"
                    }`}
                  >
                    {user.status || "active"}
                  </span>
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm btn-outline"
                    onClick={() => handleUpdateRole(user)}
                  >
                    Update Role
                  </button>
                  <button
                    className={`btn btn-sm ${
                      user.status === "suspended"
                        ? "btn-success"
                        : "btn-warning"
                    }`}
                    onClick={() => handleToggleStatus(user)}
                  >
                    {user.status === "suspended" ? "Activate" : "Suspend"}
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-4">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
