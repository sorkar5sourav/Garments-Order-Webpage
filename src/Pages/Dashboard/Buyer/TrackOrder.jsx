import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../../hooks/usePageTitle";

const TrackOrder = () => {
  usePageTitle("Track Order - Garments Order");

  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const fetchOrderById = async () => {
      if (!orderId) return;
      try {
        setLoading(true);
        const res = await axiosSecure.get(`/orders/id/${orderId}`);
        if (res?.data && res.data._id) {
          setOrder(res.data);
          setError(null);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order by id:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderById();
  }, [orderId, axiosSecure]);

  const handleSearchByTracking = async (e) => {
    e?.preventDefault?.();
    if (!trackingInput || trackingInput.trim().length === 0) {
      setError("Please enter an order ID to search");
      return;
    }

    try {
      setSearching(true);
      setLoading(true);
      setError(null);
      const res = await axiosSecure.get(
        `/orders/id/${trackingInput.trim()}`
      );
      if (res?.data && res.data._id) {
        setOrder(res.data);
      } else {
        setOrder(null);
        setError("No order found for this order ID");
      }
    } catch (err) {
        console.error("Error searching by order id:", err);
      setError("Failed to search order");
      setOrder(null);
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const timelineSteps = [
    {
      step: "Order Placed",
      status: "completed",
      icon: "📦",
      description: "Your order has been placed successfully",
    },
    {
      step: "Cutting",
      status: order?.status === "pending" ? "pending" : "completed",
      icon: "✂️",
      description: "Fabric cutting in progress",
    },
    {
      step: "Sewing",
      status:
        order?.status === "pending" || order?.status === "cutting"
          ? "pending"
          : "completed",
      icon: "🧵",
      description: "Stitching and sewing process",
    },
    {
      step: "Quality Check",
      status:
        order?.status === "pending" ||
        order?.status === "cutting" ||
        order?.status === "sewing"
          ? "pending"
          : "completed",
      icon: "✅",
      description: "Quality assurance inspection",
    },
    {
      step: "Packaging",
      status:
        order?.status === "shipped" ||
        order?.status === "delivered" ||
        order?.status === "confirmed"
          ? "completed"
          : "pending",
      icon: "📮",
      description: "Order packaging and preparation",
    },
    {
      step: "Shipped",
      status:
        order?.status === "shipped" || order?.status === "delivered"
          ? "completed"
          : "pending",
      icon: "🚚",
      description: "Order is on the way",
    },
    {
      step: "Delivered",
      status: order?.status === "delivered" ? "completed" : "pending",
      icon: "🏠",
      description: "Order delivered successfully",
    },
  ];

  // Render
  // If loading, show spinner
  // If no order and no error, show only search box (handled below)

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button (only when viewing an order) */}
        {(orderId || order) && (
          <button
            onClick={() => navigate("/dashboard/my-orders")}
            className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold"
          >
            ← Back to My Orders
          </button>
        )}

        {/* Search by Tracking ID */}
        <form
          onSubmit={handleSearchByTracking}
          className="mb-6 flex gap-2 items-center"
        >
          <input
            type="text"
            placeholder="Enter Order ID"
            value={trackingInput}
            onChange={(e) => setTrackingInput(e.target.value)}
            className="input input-bordered w-full max-w-md"
          />
          <button
            type="submit"
            className={`btn btn-primary ${searching ? "btn-disabled" : ""}`}
          >
            Search
          </button>
        </form>

        {/* Show loader / error / order details depending on state */}
        {loading && (
          <div className="flex justify-center items-center my-12">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {!loading && error && !order && (
          <div className="min-h-20 flex items-center">
            <div className="alert alert-error w-full">
              <span>{error}</span>
            </div>
          </div>
        )}

        {!loading && order && (
          <>
            <div className="bg-base-100 rounded-lg shadow-lg p-8 mb-8">
              <h1 className="text-3xl font-bold text-secondary mb-6">
                Track Order
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Order Info */}
                <div>
                  <h2 className="text-lg font-bold text-secondary mb-4">
                    Order Information
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-base-CONTENT text-sm">Order ID</p>
                      <p className="text-secondary font-mono">{order._id}</p>
                    </div>
                    <div>
                      <p className="text-base-CONTENT text-sm">Product</p>
                      <p className="text-secondary font-semibold">
                        {order.productTitle}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-CONTENT text-sm">Quantity</p>
                      <p className="text-secondary">{order.quantity} units</p>
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div>
                  <h2 className="text-lg font-bold text-secondary mb-4">
                    Delivery Details
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-base-CONTENT text-sm">Recipient</p>
                      <p className="text-secondary font-semibold">
                        {order.firstName} {order.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-base-CONTENT text-sm">Contact</p>
                      <p className="text-secondary">{order.contactNumber}</p>
                    </div>
                    <div>
                      <p className="text-base-CONTENT text-sm">Delivery Address</p>
                      <p className="text-secondary">{order.deliveryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-base-CONTENT mb-2">Current Status</p>
                <div className="flex items-center gap-3">
                  <span
                    className={`px-4 py-2 rounded-full font-bold text-white ${
                      order.status === "pending"
                        ? "bg-yellow-500"
                        : order.status === "confirmed"
                        ? "bg-blue-500"
                        : order.status === "shipped"
                        ? "bg-purple-500"
                        : order.status === "delivered"
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                  <p className="text-gray-700">
                    Ordered on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

              {/* Timeline: use trackingUpdates if present, otherwise fallback to static steps */}
              <div className="bg-base-100 rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-secondary mb-8">
                  Production & Delivery Timeline
                </h2>

                <div className="space-y-6">
                  {order.trackingUpdates && order.trackingUpdates.length > 0 ? (
                    // show tracking updates in chronological order
                    order.trackingUpdates
                      .slice()
                      .sort((a, b) => new Date(a.time) - new Date(b.time))
                      .map((log, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-4 bg-blue-100 border-blue-500 text-blue-600">
                              {String(log.status || "").charAt(0) || "•"}
                            </div>
                            {idx < order.trackingUpdates.length - 1 && (
                              <div className="w-1 h-12 bg-gray-300"></div>
                            )}
                          </div>

                          <div className="pb-6">
                            <h3 className="text-lg font-bold text-base-CONTENT">{log.status || "Update"}</h3>
                            <div className="text-sm text-gray-500 mt-1">{log.location}</div>
                            <div className="text-sm mt-2">{log.note}</div>
                            <div className="text-xs text-gray-400 mt-1">{log.time ? new Date(log.time).toLocaleString() : ""}</div>
                          </div>
                        </div>
                      ))
                  ) : (
                    // fallback static timeline
                    timelineSteps.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                              item.status === "completed"
                                ? "bg-green-100 border-green-500 text-green-600"
                                : item.status === "pending"
                                ? "bg-gray-100 border-gray-300 text-gray-400"
                                : "bg-blue-100 border-blue-500 text-blue-600"
                            }`}
                          >
                            {item.icon}
                          </div>
                          {index < timelineSteps.length - 1 && (
                            <div
                              className={`w-1 h-12 ${
                                item.status === "completed"
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></div>
                          )}
                        </div>

                        <div className="pb-6">
                          <h3
                            className={`text-lg font-bold ${
                              item.status === "completed"
                                ? "text-green-600"
                                : "text-base-CONTENT"
                            }`}
                          >
                            {item.step}
                          </h3>
                          <p className="text-gray-700 mt-1">{item.description}</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {item.status === "completed"
                              ? "✓ Completed"
                              : "⏳ In Progress or Pending"}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Additional Notes */}
                {order.additionalNotes && (
                  <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-bold text-secondary mb-2">Special Notes</h3>
                    <p className="text-gray-700">{order.additionalNotes}</p>
                  </div>
                )}
              </div>

            {/* Contact Support */}
            <div className="mt-8 bg-base-100 rounded-lg shadow-lg p-8 text-center">
              <h3 className="text-lg font-bold text-secondary mb-4">
                Need Help?
              </h3>
              <p className="text-base-CONTENT mb-4">
                If you have any questions about your order, please contact our
                support team.
              </p>
              <button className="btn btn-primary">Contact Support</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
