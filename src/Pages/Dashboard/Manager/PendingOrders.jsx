import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/atoms/Loading";
import useRole from "../../../hooks/useRole";

const PendingOrders = () => {
  const axiosSecure = useAxiosSecure();
  const { status, suspendFeedback, suspendReason } = useRole();
  const [selected, setSelected] = useState(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manager-pending-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders", { params: { status: "pending" } });
      return res.data || [];
    },
  });

  const handleUpdateStatus = async (order, nextStatus) => {
    if (status === "suspended") {
      Swal.fire(
        "Account Suspended",
        suspendFeedback ||
          suspendReason ||
          "You cannot approve or reject orders while suspended.",
        "error"
      );
      return;
    }
    const confirm = await Swal.fire({
      title: `Mark as ${nextStatus}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
    });
    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/orders/${order._id}/status`, {
        status: nextStatus,
        approvedAt: nextStatus === "approved" ? new Date().toISOString() : null,
      });
      Swal.fire("Updated", "Order status updated", "success");
      refetch();
    } catch (error) {
      if (error.response?.data?.code === "SUSPENDED") {
        Swal.fire(
          "Account Suspended",
          error.response?.data?.suspendFeedback ||
            error.response?.data?.suspendReason ||
            error.response?.data?.message ||
            "You cannot approve or reject orders while suspended.",
          "error"
        );
      } else {
        Swal.fire("Error", "Failed to update order status.", "error");
      }
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-3xl font-bold">Pending Orders</h2>
        <p className="text-sm text-gray-500">
          Approve or reject orders awaiting confirmation.
        </p>
      </div>
      {status === "suspended" && (
        <div className="alert alert-error">
          <span>
            You cannot approve or reject orders while suspended.{" "}
            {suspendFeedback || suspendReason
              ? `Feedback: ${suspendFeedback || suspendReason}`
              : ""}
          </span>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Order Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="font-mono text-sm">{order._id}</td>
                <td>
                  <div className="font-semibold">{order.name || "N/A"}</div>
                  <div className="text-xs text-gray-500">{order.email}</div>
                </td>
                <td>{order.productTitle || order.parcelName}</td>
                <td>{order.quantity}</td>
                <td className="text-sm">
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => setSelected(order)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-sm btn-success"
                    disabled={status === "suspended"}
                    onClick={() => handleUpdateStatus(order, "approved")}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm btn-error"
                    disabled={status === "suspended"}
                    onClick={() => handleUpdateStatus(order, "rejected")}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No pending orders.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div className="bg-white rounded-box shadow p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-bold">Order Details</h3>
              <p className="text-sm text-gray-500">Full order info</p>
            </div>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="font-semibold">User</p>
              <p className="text-sm">
                {selected.name} ({selected.email})
              </p>
            </div>
            <div>
              <p className="font-semibold">Product</p>
              <p className="text-sm">
                {selected.productTitle || selected.parcelName}
              </p>
            </div>
            <div>
              <p className="font-semibold">Quantity</p>
              <p className="text-sm">{selected.quantity}</p>
            </div>
            <div>
              <p className="font-semibold">Address</p>
              <p className="text-sm">{selected.deliveryAddress}</p>
            </div>
            <div>
              <p className="font-semibold">Total Price</p>
              <p className="text-sm">৳{selected.totalPrice || selected.cost}</p>
            </div>
            <div>
              <p className="font-semibold">Order Date</p>
              <p className="text-sm">
                {selected.orderDate
                  ? new Date(selected.orderDate).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;

