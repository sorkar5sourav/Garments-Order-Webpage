import React, { useState } from "react";
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
    setValue,
    trigger,
  } = useForm();
  const { signInUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleLogin = async (data) => {
    setIsLoading(true);
    setSubmitError("");
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
      const errorMessage =
        error.message || "Invalid email or password. Please try again.";
      setSubmitError(errorMessage);

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    // Demo credentials - auto-fill and submit
    const demoEmail = "demo@example.com";
    const demoPassword = "Demo123456";

    setValue("email", demoEmail);
    setValue("password", demoPassword);
    setSubmitError("");

    // Trigger validation
    const isValid = await trigger(["email", "password"]);
    if (isValid) {
      await handleLogin({ email: demoEmail, password: demoPassword });
    }
  };

  return (
    <div className="card bg-base-100 md:w-xl lg:w-2xl shrink-0 shadow-2xl md:p-20 py-10">
      <h3 className="text-3xl text-center font-bold mb-2">Welcome back</h3>
      <p className="text-center text-base-CONTENT mb-6">Please Login</p>
      <form className="card-body" onSubmit={handleSubmit(handleLogin)}>
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
            className={`input input-bordered w-full ${
              errors.email ? "input-error" : ""
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-error text-sm mt-1">{errors.email.message}</p>
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
            className={`input input-bordered w-full ${
              errors.password ? "input-error" : ""
            }`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-error text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <div className="mt-4">
            <a className="link link-hover text-sm">Forgot password?</a>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-neutral mt-6 w-full"
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Demo Login Button */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="btn btn-outline btn-primary mt-3 w-full"
          >
            🚀 Demo Login
          </button>
        </fieldset>

        <div className="divider">OR</div>

        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <SocialLogin />
          <FbLogin />
        </div>

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
