import React from "react";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";

const ManagerProfile = () => {
  const { user, logOut } = useAuth();
  const { status, suspendReason, suspendFeedback } = useRole();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div>
        <h2 className="text-3xl font-bold">My Profile</h2>
        <p className="text-sm text-gray-500">
          View your account information.
        </p>
      </div>

      <div className="card bg-white shadow">
        <div className="card-body space-y-2">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <img
                  src={user?.photoURL || "https://via.placeholder.com/150"}
                  alt="profile"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">{user?.displayName}</h3>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <div className="divider"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold">Email</p>
              <p>{user?.email}</p>
            </div>
            <div>
              <p className="font-semibold">UID</p>
              <p className="break-all">{user?.uid}</p>
            </div>
          </div>
          {status === "suspended" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-red-800">Account Suspended</p>
              <p className="text-red-700 mt-1">
                Reason: {suspendReason || "Not provided"}
              </p>
              <p className="text-red-700 mt-1">
                Feedback: {suspendFeedback || "No feedback available"}
              </p>
            </div>
          )}
          <div>
            <p className="font-semibold">Status</p>
            <p
              className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
                status === "suspended"
                  ? "bg-red-100 text-red-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {status || "active"}
            </p>
          </div>
          <button className="btn btn-error mt-4" onClick={logOut}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;

