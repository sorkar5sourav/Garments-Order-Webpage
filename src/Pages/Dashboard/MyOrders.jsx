import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaEye, FaMoneyBill, FaTrashCan } from "react-icons/fa6";
import Swal from "sweetalert2";
import { FaTimes } from "react-icons/fa";

const MyOrders = () => {
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
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        My Orders: {orders.length}
      </h2>

      {orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">You have no orders yet.</p>
          <button
            onClick={() => navigate("/products")}
            className="btn btn-primary"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gray-200">
              <tr>
                <th>#</th>
                <th>Product Title</th>
                <th>Quantity</th>
                <th>Total Price</th>
                <th>Payment Status</th>
                <th>Admin Approval</th>
                <th>Order Date</th>
                <th>Delivery Address</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <th>{index + 1}</th>
                  <td className="font-semibold">{order.productTitle}</td>
                  <td>{order.quantity} units</td>
                  <td className="font-bold text-blue-600">
                    ৳{order.totalPrice}
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.paymentStatus === "paid"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {order.paymentStatus === "paid" ? "✓ Paid" : "⏳ Unpaid"}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : order.status === "delivered"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="text-sm">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="text-sm">{order.deliveryAddress}</td>
                  <td>
                    <div className="flex gap-2 flex-wrap">
                      {order.paymentStatus === "unpaid" && (
                        <button
                          onClick={() => handlePayment(order)}
                          className="btn btn-sm btn-success"
                          title="Pay Now"
                        >
                          <FaMoneyBill />
                        </button>
                      )}
                      <button
                        onClick={() => handleViewDetails(order._id)}
                        className="btn btn-sm btn-info"
                        title="View Details & Track"
                      >
                        <FaEye />
                      </button>
                      {order.status === "pending" &&
                        order.paymentStatus === "unpaid" && (
                          <button
                            onClick={() =>
                              handleCancelOrder(order._id, order.status)
                            }
                            className="btn btn-sm btn-error"
                            title="Cancel Order"
                          >
                            <FaTimes />
                          </button>
                        )}
                      <button
                        onClick={() => handleDeleteOrder(order._id)}
                        className="btn btn-sm btn-error"
                        title="Delete Order"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
