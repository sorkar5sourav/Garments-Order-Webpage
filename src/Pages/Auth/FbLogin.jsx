import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import facebookLogo from "../../assets/facebook-svgrepo-com.svg";
const FbLogin = () => {
  const { signInFacebook } = useAuth();
  const axiosSecure = useAxiosSecure();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleFacebookSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInFacebook();
      // console.log(result.user);

      // create user in the database
      const userInfo = {
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      await axiosSecure.post("/users", userInfo);
      // console.log("user data has been stored", res.data);

      // Show success notification
      await Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: "Welcome back! You have been logged in successfully.",
        confirmButtonColor: "#3B82F6",
        timer: 2000,
        timerProgressBar: true,
      });

      navigate(location?.state?.pathname || location?.state || "/");
    } catch (error) {
      console.log(error);

      // Show error notification
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Failed to login with Facebook. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-center pb-8">
      <button
        onClick={handleFacebookSignIn}
        disabled={isLoading}
        className="btn bg-blue-500 text-white border-blue-600 hover:bg-blue-600 w-full"
      >
        {isLoading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Signing in...
          </>
        ) : (
          <>
            <img
              src={facebookLogo}
              alt="Facebook logo"
              className="w-4 h-4 mr-2 invert"
            />
            Login with Facebook
          </>
        )}
      </button>
    </div>
  );
};

export default FbLogin;
