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
    // Intercept request to add token in Authorization header
    const reqInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        // Get fresh token from Firebase auth (automatically refreshes if expired)
        try {
          // If user exists in context, we should be able to get token
          if (!user) {
            console.error("✗ No user in context - cannot authenticate request");
            return config;
          }

          // Try to get current user - Firebase should have it if user is logged in
          let currentUser = auth.currentUser;
          
          // If no current user but user exists in context, wait for Firebase to sync
          if (!currentUser && user) {
            // Wait up to 1 second for Firebase auth to sync
            for (let i = 0; i < 10 && !currentUser; i++) {
              await new Promise(resolve => setTimeout(resolve, 100));
              currentUser = auth.currentUser;
            }
          }
          
          if (currentUser) {
            const token = await currentUser.getIdToken();
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
              console.log("✓ Token added to request header for", user.email);
            } else {
              console.error("✗ Failed to get token from Firebase - token is null");
            }
          } else {
            console.error("✗ No authenticated user found in Firebase auth");
            console.log("User from context:", user?.email);
            console.log("This might indicate a Firebase auth sync issue");
          }
        } catch (error) {
          console.error("✗ Error getting token in request interceptor:", error);
          // Don't reject here - let the request proceed and server will return 401
        }
        return config;
      }
    );

    // Interceptor response to handle errors
    const resInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        console.log("Axios error:", error);
        console.log("Error response:", error.response?.data);
        console.log("Error status:", error.response?.status);

        const statusCode = error.response?.status;
        const originalRequest = error.config;

        // If 401 and we haven't retried yet, try to refresh token and retry
        if (statusCode === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            // Wait a moment for auth state to sync
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const currentUser = auth.currentUser;
            if (!currentUser && user) {
              // User exists in context, wait a bit more for Firebase to sync
              await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            const retryUser = auth.currentUser;
            if (retryUser) {
              // Get fresh token with force refresh
              const token = await retryUser.getIdToken(true);
              console.log("Retrying with refreshed token:", token.substring(0, 20) + "...");
              originalRequest.headers.Authorization = `Bearer ${token}`;
              // Retry the original request
              return axiosSecure(originalRequest);
            } else {
              console.error("No user available for token refresh");
              // If no user, log out
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

        // Handle 403: show alert then log out
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
