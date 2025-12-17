import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../../../hooks/usePageTitle";

const PaymentSuccess = () => {
  usePageTitle("Payment Successful - Garments Order");

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState(null);
  // console.log(paymentDetails);
  const [error, setError] = useState(null);

  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No payment session found");
        setLoading(false);
        return;
      }

      try {
        // Verify payment with backend
        const response = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);

        if (response.data.success) {
          setPaymentDetails(response.data);
          await Swal.fire({
            icon: "success",
            title: "Payment Successful!",
            text: "Your payment has been processed successfully.",
            confirmButtonColor: "#3B82F6",
            timer: 3000,
            timerProgressBar: true,
          });
        } else {
          throw new Error("Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        setError("Failed to verify payment. Please contact support.");
        await Swal.fire({
          icon: "error",
          title: "Payment Verification Failed",
          text: "Please contact support if you were charged.",
          confirmButtonColor: "#EF4444",
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, axiosSecure]);

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-base-100 rounded-lg shadow-lg p-8 text-center">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-lg">Verifying your payment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base-200 py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-base-100 rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">❌</div>
            <h1 className="text-3xl font-bold text-secondary mb-4">
              Payment Verification Failed
            </h1>
            <p className="text-base-CONTENT mb-6">{error}</p>
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="btn btn-primary"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Payment Successful!
          </h1>
          <p className="text-base-CONTENT mb-6">
            Your payment has been processed successfully. Your order is now confirmed.
          </p>

          {paymentDetails && (
            <div className="bg-base-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-lg font-semibold mb-4">Payment Details</h3>
              <div className="space-y-2">
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {paymentDetails.orderId}
                </p>
                {/* <p>
                  <span className="font-medium">Amount Paid:</span>{" "}
                  ৳{paymentDetails.amount}
                </p> */}
                <p>
                  <span className="font-medium">Payment ID:</span>{" "}
                  {paymentDetails.transactionId}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="text-green-600 font-semibold">Paid</span>
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate(`/dashboard/track-order/${paymentDetails.orderId}`)}
              className="btn btn-outline"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;