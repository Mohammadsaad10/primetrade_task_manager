import { useQueryClient, useMutation } from "@tanstack/react-query";
import { login } from "../lib/api";
import { toast } from "react-toastify";

const useLogin = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      localStorage.setItem("user", JSON.stringify(data));
      toast.success("Logged in successfully");
    },
  });

  return { isPending, error, loginMutation: mutate };
};

export default useLogin;
