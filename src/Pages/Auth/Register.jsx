import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import usePageTitle from "../../hooks/usePageTitle";
import FbLogin from "./FbLogin";

const Register = () => {
  usePageTitle("Register - Garments Order");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm();
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleRegistration = async (data) => {
    setSubmitting(true);
    setSubmitError("");
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
      const errorMessage =
        error.message || "Failed to create account. Please try again.";
      setSubmitError(errorMessage);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoRegistration = async () => {
    // Demo registration data - auto-fill and submit
    const demoData = {
      name: "Demo User",
      photoURL: "https://imgs.search.brave.com/xchRIrAVV4szhnTvCkhz_M5oeIy8ykB7tVAFhLpYXvw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzAxLzc3LzA4LzYw/LzM2MF9GXzE3NzA4/NjA5OV9WS1N2d3cw/VUR4cWRMMVdjaFpa/dVJGeDNEaFgzNTV5/Ui5qcGc",
      email: `demo${Date.now()}@example.com`,
      role: "buyer",
      password: "Demo123456",
    };

    setValue("name", demoData.name);
    setValue("photoURL", demoData.photoURL);
    setValue("email", demoData.email);
    setValue("role", demoData.role);
    setValue("password", demoData.password);
    setSubmitError("");

    // Trigger validation
    const isValid = await trigger([
      "name",
      "photoURL",
      "email",
      "password",
    ]);
    if (isValid) {
      await handleRegistration(demoData);
    }
  };

  return (
    <div className="card bg-base-100 w-full md:w-xl lg:w-2xl shrink-0 shadow-2xl md:px-10 py-10 md:py-20">
      <h3 className="text-3xl text-center font-bold mb-2">Welcome to Garments Order</h3>
      <p className="text-center text-base-CONTENT mb-6">Please Register</p>
      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        {/* Error Banner */}
        {submitError && (
          <div className="alert alert-error mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{submitError}</span>
          </div>
        )}

        <fieldset className="fieldset">
          {/* name field */}
          <label className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className={`input w-full input-bordered ${
              errors.name ? "input-error" : ""
            }`}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-error text-sm mt-1">{errors.name.message}</p>
          )}

          {/* photo url field */}
          <label className="label">
            <span className="label-text">Photo URL</span>
          </label>
          <input
            type="url"
            {...register("photoURL", { required: "Photo URL is required" })}
            className={`input w-full input-bordered ${
              errors.photoURL ? "input-error" : ""
            }`}
            placeholder="Enter photo URL"
          />
          {errors.photoURL && (
            <p className="text-error text-sm mt-1">{errors.photoURL.message}</p>
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
            className={`input w-full input-bordered ${
              errors.email ? "input-error" : ""
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
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
            className={`input w-full input-bordered ${
              errors.password ? "input-error" : ""
            }`}
            placeholder="Create a password"
          />
          {errors.password && (
            <p className="text-error text-sm mt-1">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-neutral mt-6 w-full"
          >
            {submitting ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>

          {/* Demo Registration Button */}
          <button
            type="button"
            onClick={handleDemoRegistration}
            disabled={submitting}
            className="btn btn-outline btn-primary mt-3 w-full"
          >
            🚀 Demo Registration
          </button>
        </fieldset>

        <div className="divider">OR</div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <SocialLogin />
          <FbLogin />
        </div>

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
