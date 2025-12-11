import axios from "axios";
import React, { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router";
import { auth } from "../Firebase/firebase.init";

const axiosSecure = axios.create({
  baseURL: "http://localhost:3000",
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
        const errorCode = error.response?.data?.code;
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

        // If 401/403 after retry, or 403 directly, log out
        if (statusCode === 403 && errorCode === "SUSPENDED") {
          // Keep user logged in so they can view suspension details
          return Promise.reject(error);
        }

        if ((statusCode === 401 && originalRequest._retry) || statusCode === 403) {
          console.error("Unauthorized access after retry - logging out");
          await logOut();
          navigate("/login");
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
