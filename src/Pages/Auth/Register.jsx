import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../hooks/usePageTitle";

const Register = () => {
  usePageTitle("Register - Garments Order");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleRegistration = async (data) => {
    setSubmitting(true);
    try {
      // 1. Register user with Firebase
      await registerUser(data.email, data.password);

      // 2. Update user profile in Firebase
      const userProfile = {
        displayName: data.name,
        photoURL: data.photoURL,
      };
      await updateUserProfile(userProfile);

      // 3. Save user info to database with default role "buyer" and status "pending"
      const userInfo = {
        email: data.email,
        name: data.name,
        photoURL: data.photoURL,
        role: data.role || "buyer", // Default to buyer if not selected
        status: "pending", // Default status
      };

      const response = await axiosSecure.post("/users", userInfo);

      const respStatus = response?.status;
      const respData = response?.data || {};

      const created =
        respStatus === 201 ||
        respData.insertedId ||
        respData.userId ||
        respData.upsertedId ||
        respData.message === "user created";

      const exists = respStatus === 200 && respData.message === "user exists";

      if (created || exists) {
        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created successfully. Please wait for admin approval to access full features.",
          confirmButtonColor: "#3B82F6",
          timer: 3000,
          timerProgressBar: true,
        });

        // 4. Redirect user after successful registration
        navigate(location.state?.pathname || "/");
        return;
      }

      throw new Error(respData.message || "Failed to create account on server");
    } catch (error) {
      console.error("Registration error:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "Failed to create account. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card bg-base-100 w-full md:w-xl lg:w-2xl shrink-0 shadow-2xl md:px-10 py-10 md:py-20">
      <h3 className="text-3xl text-center font-bold mb-2">Welcome to Garments Order</h3>
      <p className="text-center text-base-CONTENT mb-6">Please Register</p>
      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">
          {/* name field */}
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input w-full input-bordered"
            placeholder="Enter your full name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}

          {/* photo url field */}
          <label className="label">
            <span className="label-text">Photo URL</span>
          </label>
          <input
            type="url"
            {...register("photoURL", { required: "Photo URL is required" })}
            className="input w-full input-bordered"
            placeholder="Enter photo URL"
          />
          {errors.photoURL && (
            <p className="text-red-500 text-sm mt-1">{errors.photoURL.message}</p>
          )}

          {/* email field */}
          <label className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
            className="input w-full input-bordered"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          {/* role dropdown */}
          <label className="label">
            <span className="label-text">Role</span>
          </label>
          <select
            {...register("role")}
            className="select w-full select-bordered"
            defaultValue="buyer"
          >
            <option value="buyer">Buyer</option>
            <option value="manager">Manager</option>
          </select>

          {/* password */}
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <input
            type="password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
              validate: {
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password must have at least one uppercase letter",
                hasLowercase: (value) =>
                  /[a-z]/.test(value) ||
                  "Password must have at least one lowercase letter",
              },
            })}
            className="input w-full input-bordered"
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}

          <button disabled={submitting} className="btn btn-neutral mt-6 w-full">
            {submitting ? "Registering..." : "Register"}
          </button>
        </fieldset>

        <div className="divider">OR</div>

        <SocialLogin />

        <p className="text-center mt-6">
          Already have an account?{" "}
          <Link
            state={location.state}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
            to="/login"
          >
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
