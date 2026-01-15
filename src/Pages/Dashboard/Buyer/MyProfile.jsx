import React, { useState } from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../../hooks/usePageTitle";

const MyProfile = () => {
  usePageTitle("My Profile - Garments Order");

  const { user, logOut, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { role, status, suspendReason, suspendFeedback } = useRole();
  const axiosSecure = useAxiosSecure();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || "",
    photoURL: user?.photoURL || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.displayName || "",
      photoURL: user?.photoURL || "",
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update Firebase profile
      if (formData.name !== user?.displayName || formData.photoURL !== user?.photoURL) {
        await updateUserProfile({
          displayName: formData.name,
          photoURL: formData.photoURL,
        });
      }

      // Update backend database
      await axiosSecure.patch("/users/profile", {
        name: formData.name,
        photoURL: formData.photoURL,
      });

      await Swal.fire({
        icon: "success",
        title: "Profile Updated!",
        text: "Your profile has been updated successfully.",
        timer: 2000,
        timerProgressBar: true,
      });

      setIsEditing(false);
      // Reload page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error updating profile:", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: error.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        logOut()
          .then(() => {
            Swal.fire({
              title: "Logged Out!",
              text: "You have been logged out successfully.",
              icon: "success",
            });
            navigate("/login", { replace: true });
          })
          .catch((error) => {
            console.error("Logout error:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to logout. Please try again.",
              icon: "error",
            });
          });
      }
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="alert alert-error">
          <span>Please log in to view your profile</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-blue-600 to-blue-800 p-8 text-white">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-base-100 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-2xl font-bold text-blue-600">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {user.displayName || "User"}
                </h1>
                <p className="text-blue-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Information */}
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-secondary">
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="btn btn-primary btn-sm"
                >
                  Edit Profile
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Display Name */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-lg text-secondary">
                    {user.displayName || "Not set"}
                  </p>
                )}
              </div>

              {/* Photo URL */}
              {isEditing && (
                <div className="bg-base-200 p-4 rounded-lg">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Photo URL
                  </label>
                  <input
                    type="url"
                    value={formData.photoURL}
                    onChange={(e) =>
                      setFormData({ ...formData, photoURL: e.target.value })
                    }
                    className="input input-bordered w-full"
                    placeholder="Enter photo URL"
                  />
                  {formData.photoURL && (
                    <div className="mt-2">
                      <img
                        src={formData.photoURL}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Email */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <p className="text-lg text-secondary">{user.email}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed
                </p>
              </div>

              {/* UID */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  User ID
                </label>
                <p className="text-lg text-secondary font-mono break-all">
                  {user.uid}
                </p>
              </div>

              {/* Account Status */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Account Status
                </label>
                <p className="text-lg text-secondary">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      status === "suspended"
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {status || "active"}
                  </span>
                </p>
              </div>

              {/* Role */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role
                </label>
                <p className="text-lg text-secondary">
                  {role || user.role || "user"}
                </p>
              </div>
              {status === "suspended" && (
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="text-lg font-bold text-red-800 mb-2">
                    Suspension Details
                  </h3>
                  <p className="text-sm text-red-700 font-semibold">
                    Reason: {suspendReason || "Not provided"}
                  </p>
                  <p className="text-sm text-red-700 mt-1">
                    Feedback: {suspendFeedback || "No feedback available"}
                  </p>
                </div>
              )}
              {/* Last Sign In */}
              <div className="bg-base-200 p-4 rounded-lg">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Sign In
                </label>
                <p className="text-lg text-secondary">
                  {user.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "Not available"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 btn btn-primary"
                  >
                    {isSaving ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="flex-1 btn btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
