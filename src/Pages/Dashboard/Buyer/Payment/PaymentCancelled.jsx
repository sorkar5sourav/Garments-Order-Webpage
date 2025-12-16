import React from "react";
import { useNavigate } from "react-router";
import usePageTitle from "../../../../hooks/usePageTitle";

const PaymentCancelled = () => {
  usePageTitle("Payment Cancelled - Garments Order");

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold text-secondary mb-4">
            Payment Cancelled
          </h1>
          <p className="text-base-CONTENT mb-6">
            Your payment was cancelled. No charges have been made to your account.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            You can try again anytime or contact support if you need assistance.
          </p>

          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/dashboard/my-orders")}
              className="btn btn-primary"
            >
              View My Orders
            </button>
            <button
              onClick={() => navigate("/products")}
              className="btn btn-outline"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancelled;