import axios from "axios";
import React, { useEffect } from "react";
import Swal from "sweetalert2";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { auth } from "../Firebase/firebase.init";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL || "http://localhost:3000",
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        try {
          if (!user) {
            console.error("✗ No user in context - cannot authenticate request");
            return config;
          }

          let currentUser = auth.currentUser;

          if (!currentUser && user) {
            for (let i = 0; i < 10 && !currentUser; i++) {
              await new Promise((resolve) => setTimeout(resolve, 100));
              currentUser = auth.currentUser;
            }
          }

          if (currentUser) {
            const token = await currentUser.getIdToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            } else {
              console.error(
                "✗ Failed to get token from Firebase - token is null"
              );
            }
          } else {
            console.error("✗ No authenticated user found in Firebase auth");
            console.log("This might indicate a Firebase auth sync issue");
          }
        } catch (error) {
          console.error("✗ Error getting token in request interceptor:", error);
        }
        return config;
      }
    );

    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("Axios error:", error);
        // console.log("Error response:", error.response?.data);
        // console.log("Error status:", error.response?.status);

        const statusCode = error.response?.status;
        const originalRequest = error.config;

        if (statusCode === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            await new Promise((resolve) => setTimeout(resolve, 100));

            const currentUser = auth.currentUser;
            if (!currentUser && user) {
              await new Promise((resolve) => setTimeout(resolve, 500));
            }

            const retryUser = auth.currentUser;
            if (retryUser) {
              const token = await retryUser.getIdToken(true);
              // console.log("Retrying with refreshed token:", token.substring(0, 20) + "...");
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return axiosSecure(originalRequest);
            } else {
              await logOut();
              navigate("/login");
              return Promise.reject(error);
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // If refresh fails, log out
            await logOut();
            navigate("/login");
            return Promise.reject(refreshError);
          }
        }

        // Handle final 401: show warning, do not log out
        if (statusCode === 401) {
          Swal.fire({
            icon: "warning",
            title: "Access Restricted",
            text:
              error.response?.data?.message ||
              "Your account is pending approval. Please wait for activation.",
            confirmButtonColor: "#F59E0B",
          });
          navigate("/dashboard");
          return Promise.reject(error);
        }

        if (statusCode === 403) {
          await Swal.fire({
            icon: "error",
            title: "Access Denied",
            text:
              error.response?.data?.message ||
              "Your account cannot perform this action.",
            confirmButtonColor: "#EF4444",
          });
          await logOut();
          navigate("/login");
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.request.eject(reqInterceptor);
      axiosSecure.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
