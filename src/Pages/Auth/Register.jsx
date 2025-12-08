import React from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router";
import SocialLogin from "./SocialLogin";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { registerUser, updateUserProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const handleRegistration = async (data) => {
    try {
      // 1. Register user with Firebase
      await registerUser(data.email, data.password);

      // 2. Update user profile in Firebase
      const userProfile = {
        displayName: data.name,
      };
      await updateUserProfile(userProfile);

      // 3. Save user info to database
      const userInfo = {
        email: data.email,
        name: data.name,
        role: data.role,
        status: "pending",
      };
      axiosSecure
        .post("/users", userInfo)
        .then((res) => {
          if (res.data.insertedId) {
            console.log("user created in the database");
          }
        })
        .catch((error) => console.log("Database save error:", error));

      // 4. Redirect user after successful registration and profile update
      navigate(location.state?.pathname || "/");
    } catch (error) {
      console.log("Registration error:", error.message);
    }
  };

  return (
    <div className="card bg-base-100 w-full mx-auto max-w-sm shrink-0 shadow-2xl">
      <h3 className="text-3xl text-center">Welcome to Zap Shift</h3>
      <p className="text-center">Please Register</p>
      <form className="card-body" onSubmit={handleSubmit(handleRegistration)}>
        <fieldset className="fieldset">
          {/* name field */}
          <label className="label">Name</label>
          <input
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input"
            placeholder="Your Name"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          {/* photo url field */}
          <label className="label">Photo URL</label>
          <input
            type="text"
            {...register("photoURL", { required: "Photo URL is required" })}
            className="input"
            placeholder="Enter photo URL"
          />
          {errors.photoURL && (
            <p className="text-red-500">{errors.photoURL.message}</p>
          )}

          {/* email field */}
          <label className="label">Email</label>
          <input
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {/* role dropdown */}
          <label className="label">Role</label>
          <select
            {...register("role", { required: "Role is required" })}
            className="select select-bordered"
          >
            <option value="">Select Role</option>
            <option value="buyer">Buyer</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <p className="text-red-500">{errors.role.message}</p>}

          {/* password */}
          <label className="label">Password</label>
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
            className="input"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <button className="btn btn-neutral mt-4">Register</button>
        </fieldset>
        <p>
          Already have an account{" "}
          <Link
            state={location.state}
            className="text-blue-400 underline"
            to="/login"
          >
            Login
          </Link>
        </p>
      </form>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
