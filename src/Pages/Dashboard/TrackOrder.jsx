import React, { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Loading from "../../Components/atoms/Loading";

const TrackOrder = () => {
  const axiosSecure = useAxiosSecure();
  const [orderId, setOrderId] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    if (!orderId) return;
    setLoading(true);
    setError("");
    try {
      const res = await axiosSecure.get(`/orders/id/${orderId}`);
      setOrder(res.data);
      if (!res.data?._id) {
        setError("Order not found");
      }
    } catch (err) {
      setError("Order not found");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <input
          className="input input-bordered w-80"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button className="btn btn-primary" onClick={fetchOrder} disabled={loading}>
          Track
        </button>
      </div>
      {loading && <Loading />}
      {error && <div className="alert alert-error">{error}</div>}
      {order && order._id && !error && (
        <div className="card bg-white shadow">
          <div className="card-body space-y-2">
            <h3 className="text-xl font-bold">Order {order._id}</h3>
            <p className="text-sm text-gray-500">
              {order.productTitle} — Qty: {order.quantity}
            </p>
            <div className="divider">Tracking</div>
            {(order.trackingUpdates || []).length === 0 && (
              <p className="text-gray-500">No tracking updates yet.</p>
            )}
            {(order.trackingUpdates || []).map((log, idx) => (
              <div key={idx} className="border-l-4 border-primary pl-3 py-1 space-y-1">
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

export default TrackOrder;

