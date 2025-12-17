import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../..//hooks/useAxiosSecure";
import { FaEye, FaMoneyBill, FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";
import usePageTitle from "../../../hooks/usePageTitle";

const MyOrders = () => {
  usePageTitle("My Orders - Garments Order");

  const { user } = useAuth();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const { data: orders = [], refetch } = useQuery({
    queryKey: ["my-orders", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleViewDetails = (orderId) => {
    navigate(`/dashboard/track-order/${orderId}`);
  };

  const handleCancelOrder = (orderId, orderStatus) => {
    if (orderStatus !== "pending") {
      Swal.fire({
        icon: "warning",
        title: "Cannot Cancel",
        text: "Only pending orders can be canceled.",
      });
      return;
    }

    Swal.fire({
      title: "Cancel Order?",
      text: "Are you sure you want to cancel this order?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure
          .patch(`/orders/${orderId}`, { status: "cancelled" })
          .then((res) => {
            if (res.data.modifiedCount > 0) {
              refetch();
              Swal.fire({
                icon: "success",
                title: "Cancelled!",
                text: "Your order has been cancelled.",
              });
            }
          })
          .catch((error) => {
            console.error("Error canceling order:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to cancel order. Please try again.",
            });
          });
      }
    });
  };

  const handleDeleteOrder = (orderId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/orders/${orderId}`).then((res) => {
          if (res.data.deletedCount) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your order has been deleted.",
              icon: "success",
            });
          }
        });
      }
    });
  };

  const handlePayment = async (order) => {
    try {
      const orderInfo = {
        cost: order.totalPrice || order.cost || order.total || 0,
        parcelId: order._id,
        senderEmail: order.email || order.senderEmail || order.userEmail,
        parcelName: order.productTitle || order.parcelName || "Order",
      };

      console.log("Creating checkout session with:", orderInfo);

      const res = await axiosSecure.post(
        "/payment-checkout-session",
        orderInfo
      );

      console.log("Checkout session response:", res?.data);

      const url = res?.data?.url;
      if (!url) {
        console.error("No checkout URL returned from server", res?.data);
        alert("Failed to create checkout session. See console for details.");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.assign(url);
    } catch (err) {
      console.error("Error creating checkout session:", err?.response || err);
      alert("Unable to initiate payment. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-base-100 p-4 sm:p-6 lg:p-8">
      <div className="w-full">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary mb-2">
            My Orders
          </h2>
          <p className="text-base-content/70">Track and manage your garment orders</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-base-100 rounded-lg shadow-lg p-8 sm:p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-4">No Orders Yet</h3>
            <p className="text-base-content/70 mb-6">You haven't placed any orders yet. Start shopping now!</p>
            <button
              onClick={() => navigate("/products")}
              className="btn btn-primary btn-lg"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-base-300">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-semibold">Your Orders ({orders.length})</h3>
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-primary">Total: {orders.length}</span>
                  <span className="badge badge-success">
                    Completed: {orders.filter(order => order.status === "delivered").length}
                  </span>
                  <span className="badge badge-warning">
                    Pending: {orders.filter(order => order.status === "pending").length}
                  </span>
                </div>
              </div>
            </div>
                <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th className="text-xs">#</th>
                    <th className="text-xs">Product</th>
                    <th className="text-xs">Quantity</th>
                    <th className="text-xs">Total</th>
                    <th className="text-xs">Payment</th>
                    <th className="text-xs">Status</th>
                    <th className="text-xs hidden md:table-cell">Date</th>
                    <th className="text-xs hidden lg:table-cell">Address</th>
                    <th className="text-xs">Actions</th>
                  </tr>
                </thead>
                    <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id} className="hover">
                      <th className="font-medium">{index + 1}</th>
                      <td className="font-medium max-w-xs truncate" title={order.productTitle}>
                        {order.productTitle}
                      </td>
                      <td className="font-medium">{order.quantity} units</td>
                      <td className="font-bold text-primary">৳{order.totalPrice?.toLocaleString()}</td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            order.paymentStatus === "paid"
                              ? "badge-success"
                              : "badge-warning"
                          }`}
                        >
                          {order.paymentStatus === "paid" ? "✓ Paid" : "⏳ Unpaid"}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge badge-sm ${
                            order.status === "pending"
                              ? "badge-warning"
                              : order.status === "confirmed"
                              ? "badge-info"
                              : order.status === "shipped"
                              ? "badge-primary"
                              : order.status === "delivered"
                              ? "badge-success"
                              : "badge-error"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="text-sm hidden md:table-cell">
                        {new Date(order.orderDate).toLocaleDateString()}
                      </td>
                      <td className="text-sm hidden lg:table-cell max-w-xs truncate" title={order.deliveryAddress}>
                        {order.deliveryAddress}
                      </td>
                      <td>
                        <div className="flex gap-1">
                          {order.paymentStatus === "unpaid" && (
                            <button
                              onClick={() => handlePayment(order)}
                              className="btn btn-xs btn-success"
                              title="Pay Now"
                            >
                              <FaMoneyBill className="text-xs" />
                            </button>
                          )}
                          <button
                            onClick={() => handleViewDetails(order._id)}
                            className="btn btn-xs btn-info"
                            title="View Details & Track"
                          >
                            <FaEye className="text-xs" />
                          </button>
                          {order.status === "pending" &&
                            order.paymentStatus === "unpaid" && (
                              <button
                                onClick={() =>
                                  handleCancelOrder(order._id, order.status)
                                }
                                className="btn btn-xs btn-error"
                                title="Cancel Order"
                              >
                                <FaTimes className="text-xs" />
                              </button>
                            )}
                          <button
                            onClick={() => handleDeleteOrder(order._id)}
                            className="btn btn-xs btn-error"
                            title="Delete Order"
                          >
                            <FaTrashCan className="text-xs" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
          </table>
        </div>
      </div>)}
    </div>
    </div>
  );
};

export default MyOrders;
