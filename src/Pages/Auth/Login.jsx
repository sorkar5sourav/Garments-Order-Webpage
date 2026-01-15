import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import Swal from "sweetalert2";
import usePageTitle from "../../hooks/usePageTitle";
import FbLogin from "./FbLogin";

const Login = () => {
  usePageTitle("Login - Garments Order");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogin = async (data) => {
    try {
      await signInUser(data.email, data.password);

      // Show success alert
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back! You have been logged in successfully.",
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate(location?.state?.pathname || "/");
    } catch (error) {
      console.error("Login error:", error);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid email or password. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  return (
    <div className="card bg-base-100 md:w-xl lg:w-2xl shrink-0 shadow-2xl md:p-20 py-10">
      <h3 className="text-3xl text-center font-bold mb-2">Welcome back</h3>
      <p className="text-center text-base-CONTENT mb-6">Please Login</p>
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
        <fieldset className="fieldset">
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
            className="input input-bordered w-full"
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}

          {/* password field */}
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
            })}
            className="input input-bordered w-full"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <div className="mt-4">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>
          <button className="btn btn-neutral mt-6 w-full">Login</button>
        </fieldset>

        <div className="divider">OR</div>

        <SocialLogin />
        <FbLogin />

        <p className="text-center mt-6">
          New to Garments Order?{" "}
          <Link
            state={location.state}
            className="text-blue-600 hover:text-blue-800 underline font-medium"
            to="/register"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
