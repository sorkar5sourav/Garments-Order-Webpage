import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../Components/atoms/Loading";

const ApprovedOrders = () => {
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState(null);

  const {
    data: orders = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["manager-approved-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders", { params: { status: "approved" } });
      return res.data || [];
    },
  });

  const addTracking = async (order) => {
    const { value: payload } = await Swal.fire({
      title: "Add Tracking Update",
      html: `
        <input id="loc" class="input input-bordered w-full my-2" placeholder="Location" />
        <input id="note" class="input input-bordered w-full my-2" placeholder="Note" />
        <select id="status" class="select select-bordered w-full my-2">
          <option>Cutting Completed</option>
          <option>Sewing Started</option>
          <option>Finishing</option>
          <option>QC Checked</option>
          <option>Packed</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
        </select>
      `,
      showCancelButton: true,
      focusConfirm: false,
      preConfirm: () => ({
        location: document.getElementById("loc").value,
        note: document.getElementById("note").value,
        status: document.getElementById("status").value,
        time: new Date().toISOString(),
      }),
    });
    if (!payload) return;

    await axiosSecure.patch(`/orders/${order._id}/tracking`, payload);
    Swal.fire("Saved", "Tracking update added", "success");
    refetch();
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-3xl font-bold">Approved Orders</h2>
        <p className="text-sm text-gray-500">
          Add tracking updates for approved orders.
        </p>
      </div>

      <div className="overflow-x-auto bg-white rounded-box shadow">
        <table className="table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Approved Date</th>
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
                  {order.approvedAt
                    ? new Date(order.approvedAt).toLocaleDateString()
                    : "N/A"}
                </td>
                <td className="flex justify-end gap-2">
                  <button
                    className="btn btn-sm"
                    onClick={() => setSelected(order)}
                  >
                    View Tracking
                  </button>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => addTracking(order)}
                  >
                    Add Tracking
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-gray-500 py-4">
                  No approved orders.
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
              <h3 className="text-xl font-bold">Tracking Timeline</h3>
              <p className="text-sm text-gray-500">{selected._id}</p>
            </div>
            <button
              className="btn btn-sm btn-circle"
              onClick={() => setSelected(null)}
            >
              ✕
            </button>
          </div>
          <div className="mt-4 space-y-3">
            {(selected.trackingUpdates || []).length === 0 && (
              <p className="text-gray-500">No tracking updates yet.</p>
            )}
            {(selected.trackingUpdates || []).map((log, idx) => (
              <div
                key={idx}
                className="border-l-4 border-primary pl-3 py-1 space-y-1"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold">{log.status}</span>
                  <span className="text-gray-500">
                    {log.time ? new Date(log.time).toLocaleString() : ""}
                  </span>
                </div>
                <div className="text-sm">{log.location}</div>
                <div className="text-xs text-gray-500">{log.note}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedOrders;

