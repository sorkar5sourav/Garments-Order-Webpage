import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: userMeta } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);

      return res.data || { role: "user", status: "active" };
    },
  });

  return {
    role: userMeta?.role || "user",
    status: userMeta?.status || "active",
    suspendReason: userMeta?.suspendReason || null,
    suspendFeedback: userMeta?.suspendFeedback || null,
    roleLoading,
  };
};

export default useRole;
