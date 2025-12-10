import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get("/orders");
        const selectedOrder = response.data.find((o) => o._id === orderId);

        if (selectedOrder) {
          setOrder(selectedOrder);
          setError(null);
        } else {
          setError("Order not found");
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, axiosSecure]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>{error || "Order not found"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard/my-orders")}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2 font-semibold"
        >
          ← Back to My Orders
        </button>

        {/* Order Summary Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Track Order</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Order Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Order Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Order ID</p>
                  <p className="text-gray-900 font-mono">{order._id}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Product</p>
                  <p className="text-gray-900 font-semibold">
                    {order.productTitle}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Quantity</p>
                  <p className="text-gray-900">{order.quantity} units</p>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Delivery Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-gray-600 text-sm">Recipient</p>
                  <p className="text-gray-900 font-semibold">
                    {order.firstName} {order.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Contact</p>
                  <p className="text-gray-900">{order.contactNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Delivery Address</p>
                  <p className="text-gray-900">{order.deliveryAddress}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">Current Status</p>
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

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            Production & Delivery Timeline
          </h2>

          <div className="space-y-6">
            {timelineSteps.map((item, index) => (
              <div key={index} className="flex gap-4">
                {/* Timeline Dot and Line */}
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

                {/* Timeline Content */}
                <div className="pb-6">
                  <h3
                    className={`text-lg font-bold ${
                      item.status === "completed"
                        ? "text-green-600"
                        : "text-gray-600"
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
            ))}
          </div>

          {/* Additional Notes */}
          {order.additionalNotes && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-bold text-gray-900 mb-2">Special Notes</h3>
              <p className="text-gray-700">{order.additionalNotes}</p>
            </div>
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please contact our
            support team.
          </p>
          <button className="btn btn-primary">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default TrackOrder;
