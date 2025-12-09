import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FiEdit } from "react-icons/fi";
import { FaMagnifyingGlass, FaTrashCan, FaMoneyBill } from "react-icons/fa6";
import Swal from "sweetalert2";
import { Link } from "react-router";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: parcels = [], refetch } = useQuery({
    queryKey: ["my-parcels", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
  });

  const handleParcelDelete = (id) => {
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
        axiosSecure.delete(`/orders/${id}`).then((res) => {
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
        trackingId: order.trackingId || "",
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
        My Orders: {parcels.length}
      </h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-gray-200">
            <tr>
              <th>#</th>
              <th>Product Title</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Delivery Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              parcels.map((order, index) => (
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
                        order.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : order.status === "confirmed"
                          ? "bg-blue-100 text-blue-800"
                          : order.status === "shipped"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
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
                      <button
                        onClick={() => handlePayment(order)}
                        className="btn btn-sm btn-success"
                        title="Pay"
                      >
                        <FaMoneyBill />
                      </button>
                      <button
                        className="btn btn-sm btn-info"
                        title="View Details"
                      >
                        <FaMagnifyingGlass />
                      </button>
                      <button className="btn btn-sm btn-warning" title="Edit">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => handleParcelDelete(order._id)}
                        className="btn btn-sm btn-error"
                        title="Delete"
                      >
                        <FaTrashCan />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
