import { useState } from "react";
import useAuthUser from "../hooks/useAuthUser.js";
import useTasks from "../hooks/useTasks.js";
import useLogout from "../hooks/useLogout.js";

const Dashboard = () => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    status: "pending",
  });

  const [editingId, setEditingId] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const { authUser } = useAuthUser();

  const {
    tasksData,
    isLoading,
    error,
    createTaskMutation,
    isCreating,
    deleteTaskMutation,
    deleting,
    updateTaskMutation,
    updating,
  } = useTasks();

  const tasks = tasksData ? tasksData.data : [];

  // Handle logout
  const { logoutMutation } = useLogout();
  const handleLogout = () => {
    logoutMutation();
  };

  // Handle Form Submit ( create or update based on editingId state )
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      updateTaskMutation({ taskId: editingId, taskData });
      resetForm();
    } else {
      createTaskMutation(taskData);
      resetForm();
    }
  };

  // Handle Delete
  const handleDeleteClick = (taskId) => {
    setTaskToDelete(taskId);
  };

  // Confirm Delete
  const confirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation(taskToDelete);
      setTaskToDelete(null);
    }
  };

  // Cancel Delete
  const cancelDelete = () => {
    setTaskToDelete(null);
  };

  // Populate Form for Editing
  const handleEditClick = (task) => {
    setEditingId(task._id);
    setTaskData({
      title: task.title,
      description: task.description,
      status: task.status,
    });
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset Form Helper
  const resetForm = () => {
    setEditingId(null);
    setTaskData({ title: "", description: "", status: "pending" });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <h1 className="text-xl font-bold text-indigo-600 tracking-tight">
              PrimeTrade Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 hidden sm:block">
                Welcome,{" "}
                <b>
                  {authUser?.username
                    ? authUser.username.charAt(0).toUpperCase() +
                      authUser.username.slice(1)
                    : "Dear"}
                </b>
                {authUser?.role && (
                  <span className="ml-1 text-xs bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">
                    {authUser.role}
                  </span>
                )}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {error && (
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">
              {error?.message ||
                error?.response?.data?.error ||
                "An error occurred"}
            </span>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-5xl py-10 px-4">
        {/* --- Task Form Section --- */}
        <div className="mb-10 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Task" : "Create New Task"}
            </h2>
            {editingId && (
              <span className="text-xs font-medium text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Title
              </label>
              <input
                type="text"
                name="title"
                placeholder="e.g., Fix Backend Bug"
                value={taskData.title}
                onChange={(e) =>
                  setTaskData({ ...taskData, title: e.target.value })
                }
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm"
              />
            </div>

            <div className="col-span-2 md:col-span-1">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Status
              </label>
              <select
                name="status"
                value={taskData.status}
                onChange={(e) =>
                  setTaskData({ ...taskData, status: e.target.value })
                }
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-white text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the task details..."
                value={taskData.description}
                onChange={(e) =>
                  setTaskData({ ...taskData, description: e.target.value })
                }
                required
                rows="3"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border text-sm"
              ></textarea>
            </div>

            <div className="col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={isCreating || updating}
                className={`flex-1 rounded-md px-4 py-2.5 text-white font-medium text-sm shadow-sm transition-all ${
                  editingId
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-900 hover:bg-gray-800"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {editingId
                  ? updating
                    ? "Updating..."
                    : "Update Task"
                  : isCreating
                    ? "Adding..."
                    : "Create Task"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-md bg-white border border-gray-300 px-4 py-2.5 text-gray-700 hover:bg-gray-50 text-sm font-medium shadow-sm transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* --- Task List Section --- */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Your Tasks</h2>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Total: {tasks.length}
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">
              No tasks found. Create one above to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`group relative flex flex-col justify-between rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
                  task.status === "completed"
                    ? "border-green-200 bg-green-50/30"
                    : task.status === "in-progress"
                      ? "border-blue-200 bg-blue-50/30"
                      : "border-gray-200"
                }`}
              >
                {/* Delete Confirmation Overlay */}
                {taskToDelete === task._id && (
                  <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10 p-2">
                    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-xl w-full max-w-xs sm:max-w-sm mx-auto">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                        Delete Task
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                        Are you sure you want to delete this task? This action
                        cannot be undone.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                        <button
                          onClick={cancelDelete}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors order-2 sm:order-1"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={confirmDelete}
                          disabled={deleting}
                          className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors order-1 sm:order-2"
                        >
                          {deleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase ${
                        task.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : task.status === "in-progress"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {task.status}
                    </span>

                    {/* Only show delete if user owns task or is admin - handled by backend but good for UI */}
                    <button
                      onClick={() => handleDeleteClick(task._id)}
                      disabled={deleting}
                      className="text-gray-400 hover:text-red-500 transition p-1"
                      title="Delete Task"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  <h3 className="text-md font-semibold text-gray-900 leading-tight mb-2">
                    {task.title}
                  </h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                    {task.description}
                  </p>
                </div>

                <div className="flex justify-between">
                  {/* Show owner info for admin users */}
                  {authUser?.role === "admin" && task.user && (
                    <div className="mb-4 p-2 bg-blue-50 rounded-md border border-blue-200">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-blue-600"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs font-medium text-blue-800">
                          Owner: {task.user.username || "User XYZ"}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-gray-100 ">
                    <button
                      onClick={() => handleEditClick(task)}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition"
                    >
                      Edit Task
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                        <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
