import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import Loading from "../../../Components/atoms/Loading";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const statusOptions = ["all", "pending", "approved", "rejected", "shipped"];

const AdminOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-orders", statusFilter],
    queryFn: async () => {
      const params =
        statusFilter === "all" ? {} : { status: statusFilter.toLowerCase() };
      const res = await axiosSecure.get("/orders", { params });
      return res.data || [];
    },
  });

  const handleStatusUpdate = async (order, status) => {
    const confirmed = await Swal.fire({
      title: `Mark as ${status}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update",
    });
    if (!confirmed.isConfirmed) return;

    try {
      await axiosSecure.patch(`/orders/${order._id}/status`, { status });
      Swal.fire("Updated", "Order status updated.", "success");
      refetch();
    } catch (error) {
      if (error.response?.data?.code === "SUSPENDED") {
        Swal.fire(
          "Account Suspended",
          error.response?.data?.suspendFeedback ||
            error.response?.data?.suspendReason ||
            error.response?.data?.message ||
            "You cannot update order status while suspended.",
          "error"
        );
      } else {
        Swal.fire("Error", "Failed to update order status.", "error");
      }
    }
  };

  if (isLoading) return <Loading />;

  const filtered = statusFilter === "all"
    ? orders
    : orders.filter((o) => (o.status || "").toLowerCase() === statusFilter);

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">All Orders</h2>
          <p className="text-sm text-gray-500">
            Review every order, filter by status, and update progress.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold">Status</label>
          <select
            className="select select-bordered"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
          <div className="badge badge-outline">Total: {filtered.length}</div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((order) => (
              <tr key={order._id}>
                <td className="font-mono text-sm">{order._id}</td>
                <td>
                  <div className="font-semibold">{order.name || "N/A"}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td>{order.productTitle || order.parcelName || "N/A"}</td>
                <td>{order.quantity || 1}</td>
                <td>
                  <span className="badge badge-neutral uppercase">
                    {order.status}
                  </span>
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => setSelectedOrder(order)}
                  >
                    View
                  </button>
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-sm btn-outline">
                      Update
                    </div>
                    <ul
                      tabIndex={0}
                      className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40"
                    >
                      {["pending", "approved", "rejected", "shipped"].map(
                        (status) => (
                          <li key={status}>
                            <button
                              onClick={() => handleStatusUpdate(order, status)}
                            >
                              {status}
                            </button>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No orders found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <div className="bg-white rounded-box shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">Order Details</h3>
              <p className="text-sm text-gray-500">
                Tracking and full information
              </p>
            </div>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-semibold">Order ID</p>
              <p className="text-sm">{selectedOrder._id}</p>
            </div>
            <div>
              <p className="font-semibold">User</p>
              <p className="text-sm">
                {selectedOrder.name} ({selectedOrder.email})
              </p>
            </div>
            <div>
              <p className="font-semibold">Product</p>
              <p className="text-sm">
                {selectedOrder.productTitle || selectedOrder.parcelName}
              </p>
            </div>
            <div>
              <p className="font-semibold">Quantity</p>
              <p className="text-sm">{selectedOrder.quantity}</p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p className="text-sm capitalize">{selectedOrder.status}</p>
            </div>
            <div>
              <p className="font-semibold">Delivery Address</p>
              <p className="text-sm">{selectedOrder.deliveryAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Total Price</p>
              <p className="text-sm">
                ৳{selectedOrder.totalPrice || selectedOrder.cost}
              </p>
            </div>
            <div>
              <p className="font-semibold">Created</p>
              <p className="text-sm">
                {selectedOrder.orderDate
                  ? new Date(selectedOrder.orderDate).toLocaleString()
                  : selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;

