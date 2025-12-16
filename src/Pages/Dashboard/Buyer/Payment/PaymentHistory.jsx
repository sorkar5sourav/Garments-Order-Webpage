import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import usePageTitle from "../../../../hooks/usePageTitle";


const PaymentHistory = () => {
  usePageTitle
  ("Payment History - Garments Order");

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payment-history", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data || [];
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center min-h-64">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold">Payment History</h2>
          <p className="text-sm text-gray-500">
            View all your payment transactions
          </p>
        </div>
        <div className="badge badge-info badge-outline">
          Total Payments: {payments.length}
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="bg-base-100 rounded-lg shadow p-8 text-center">
          <p className="text-xl text-gray-500 mb-4">No payment history found.</p>
          <p className="text-base-CONTENT">
            Your successful payments will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow">
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Order ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="font-mono text-sm">{payment._id}</td>
                  <td className="font-semibold">{payment.orderId}</td>
                  <td className="font-bold text-green-600">৳{payment.amount}</td>
                  <td>
                    <span className="badge badge-success">Completed</span>
                  </td>
                  <td className="text-sm">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="font-mono text-sm">{payment.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;