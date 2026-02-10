import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { fetchTasks, updateTask, deleteTask, createTask } from "../lib/api.js";

const useTasks = () => {
  const queryClient = useQueryClient();

  // 1. Fetch Tasks
  const {
    data: tasksData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    enabled: !!queryClient.getQueryData(["authUser"]), // Only fetch if user is authenticated
  });

  // 2. Create Task Mutation
  const { mutate: createTaskMutation, isPending: isCreating } = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task added");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to add task");
    },
  });

  // 3. Delete Task Mutation
  const { mutate: deleteTaskMutation, isPending: deleting } = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.info("Task deleted");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to delete task");
    },
  });

  //4.Update Task Mutation
  const { mutate: updateTaskMutation, isPending: updating } = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("Task updated");
    },
    onError: (err) => {
      toast.error(err.response?.data?.error || "Failed to update task");
    },
  });

  return {
    tasksData,
    isLoading,
    error,
    createTaskMutation,
    isCreating,
    deleteTaskMutation,
    deleting,
    updateTaskMutation,
    updating,
  };
};

export default useTasks;
