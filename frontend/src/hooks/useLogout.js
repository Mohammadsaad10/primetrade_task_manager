import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../lib/api.js";
import { toast } from "react-toastify";

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      toast.success("Logged out successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to logout");
    },
  });

  return { logoutMutation };
};

export default useLogout;
