import { useQueryClient, useMutation } from "@tanstack/react-query";
import { register } from "../lib/api";

const useRegister = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, error } = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      localStorage.setItem("user", JSON.stringify(data));
    },
  });

  return { isPending, error, registerMutation: mutate };
};

export default useRegister;
