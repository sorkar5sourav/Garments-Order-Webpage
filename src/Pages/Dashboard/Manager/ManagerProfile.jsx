import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useRole from "../../../hooks/useRole";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../../hooks/usePageTitle";

const ManagerProfile = () => {
  usePageTitle("My Profile - Manager Dashboard");

  const { user, logOut, updateUserProfile } = useAuth();
  const { status, suspendReason, suspendFeedback } = useRole();
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

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Profile</h2>
          <p className="text-sm text-gray-500">
            {isEditing ? "Edit your account information" : "View your account information"}
          </p>
        </div>
        {!isEditing && (
          <button onClick={handleEdit} className="btn btn-primary btn-sm">
            Edit Profile
          </button>
        )}
      </div>

      <div className="card bg-base-100 shadow">
        <div className="card-body space-y-4">
          <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-20 rounded-full">
                <img
                  src={user?.photoURL || "https://ui-avatars.com/api/?name="+(user?.displayName || 'User')}
                  alt="profile"
                />
              </div>
            </div>
            <div>
              {isEditing ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input input-bordered input-sm"
                    placeholder="Full Name"
                  />
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-semibold">{user?.displayName}</h3>
                  <p className="text-sm text-base-content">{user?.email}</p>
                </>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="space-y-2">
              <label className="label">
                <span className="label-text">Photo URL</span>
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

          <div className="divider"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold">Email</p>
              <p>{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
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

          {isEditing ? (
            <div className="flex gap-3 mt-4">
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
            <button className="btn btn-error mt-4" onClick={logOut}>
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerProfile;

