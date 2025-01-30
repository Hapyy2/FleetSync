"use client";

import { useState, useEffect, useCallback } from "react";
import { io } from "socket.io-client";
import {
  FiSearch,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
  FiPackage,
  FiX,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";
import { useRouter } from "next/navigation";

const TaskList = () => {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // Memoize socket setup to prevent unnecessary recreations
  const setupSocketHandlers = useCallback(
    (newSocket) => {
      const handleTaskUpdate = (updatedTasks) => {
        setTasks(updatedTasks);
        setLoading(false);

        if (selectedTask) {
          const updatedSelectedTask = updatedTasks.find(
            (task) => task._id === selectedTask._id
          );
          if (updatedSelectedTask) {
            setSelectedTask(updatedSelectedTask);
          }
        }
      };

      const handleInitialUserData = (data) => {
        console.log("Received user data:", data);
        setUserRole(data.role);
        newSocket.emit("requestInitialTasks");
      };

      const handleSocketError = (error) => {
        setError(error.message);
        setLoading(false);
        setTimeout(() => setError(null), 3000);
      };

      const handleStatusUpdateSuccess = ({ taskId, newStatus }) => {
        setSuccess(`Task status successfully updated to ${newStatus}`);
        setTimeout(() => setSuccess(null), 3000);
      };

      newSocket.on("initialUserData", handleInitialUserData);
      newSocket.on("taskUpdate", handleTaskUpdate);
      newSocket.on("searchResults", handleTaskUpdate);
      newSocket.on("error", handleSocketError);
      newSocket.on("statusUpdateSuccess", handleStatusUpdateSuccess);

      return () => {
        newSocket.off("initialUserData", handleInitialUserData);
        newSocket.off("taskUpdate", handleTaskUpdate);
        newSocket.off("searchResults", handleTaskUpdate);
        newSocket.off("error", handleSocketError);
        newSocket.off("statusUpdateSuccess", handleStatusUpdateSuccess);
      };
    },
    [selectedTask]
  );

  // Socket connection effect
  useEffect(() => {
    const newSocket = io("https://localhost:3000", {
      withCredentials: true,
    });

    const cleanup = setupSocketHandlers(newSocket);

    setSocket(newSocket);

    return () => {
      cleanup();
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleSearch = useCallback(() => {
    if (socket) {
      setLoading(true);
      socket.emit("searchTasks", { searchTerm });
    }
  }, [socket, searchTerm]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <FiCheckCircle className="text-green-600 w-5 h-5" />;
      case "In progress":
        return (
          <FiLoader className="text-blue-600 w-5 h-5 animate-[spin_3s_linear_infinite]" />
        );
      case "On hold":
        return <FiClock className="text-yellow-600 w-5 h-5" />;
      case "Waiting":
        return <FiPackage className="text-purple-600 w-5 h-5" />;
      default:
        return <FiAlertCircle className="text-red-600 w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "text-green-700";
      case "In progress":
        return "text-blue-700";
      case "On hold":
        return "text-yellow-700";
      case "Waiting":
        return "text-purple-700";
      default:
        return "text-red-700";
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `https://localhost:3000/api/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setSuccess("Task deleted successfully");

      if (socket) {
        socket.emit("requestInitialTasks");
      }

      // Clear the selected task
      setSelectedTask(null);
    } catch (error) {
      setError("Failed to delete task: " + error.message);
    }
  };

  const handleStatusUpdate = (taskId, newStatus) => {
    if (socket) {
      socket.emit("updateTaskStatus", { taskId, newStatus });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search tasks..."
            className="flex-1 p-2 border rounded-md border-gray-300 text-gray-800 placeholder-gray-500"
          />
          <button
            onClick={handleSearch}
            className="bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 flex items-center gap-2"
          >
            <FiSearch className="w-5 h-5" /> Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center items-center h-32">
          <FiLoader className="animate-spin text-4xl text-teal-600" />
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md mb-4 font-medium">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-700 p-4 rounded-md mb-4 font-medium">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            onClick={() => setSelectedTask(task)}
            className="border rounded-lg p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {task.name}
              </h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(task.status)}
                <span
                  className={`text-sm font-medium ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-gray-700">
                Delivery: {new Date(task.deliveryDate).toLocaleDateString()}
              </p>
              {task.driver && (
                <p className="text-gray-700">
                  Driver: {task.driver.name} {task.driver.surname}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedTask.name}
              </h2>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Status</h3>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedTask.status)}
                  <span
                    className={`${getStatusColor(
                      selectedTask.status
                    )} font-medium`}
                  >
                    {selectedTask.status}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-semibold text-gray-800">Delivery Date</h3>
                <p className="text-gray-700">
                  {new Date(selectedTask.deliveryDate).toLocaleDateString()}
                </p>
              </div>

              {selectedTask.driver && (
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">Driver</h3>
                  <p className="text-gray-700">
                    {selectedTask.driver.name} {selectedTask.driver.surname}
                  </p>
                </div>
              )}

              {selectedTask.truck && (
                <div className="space-y-1">
                  <h3 className="font-semibold text-gray-800">Truck</h3>
                  <p className="text-gray-700">{selectedTask.truck}</p>
                </div>
              )}

              <div className="col-span-2 space-y-1">
                <h3 className="font-semibold text-gray-800">
                  Delivery Address
                </h3>
                <div className="text-gray-700">
                  <p>{selectedTask.deliveryAddress.address}</p>
                  <p>
                    {selectedTask.deliveryAddress.city},{" "}
                    {selectedTask.deliveryAddress.state}{" "}
                    {selectedTask.deliveryAddress.postalCode}
                  </p>
                  <p>{selectedTask.deliveryAddress.country}</p>
                </div>
              </div>

              <div className="col-span-2 space-y-1">
                <h3 className="font-semibold text-gray-800">Description</h3>
                <p className="text-gray-700">{selectedTask.description}</p>
              </div>

              {userRole === "coordinator" && (
                <div className="col-span-2 space-y-2">
                  <h3 className="font-semibold text-gray-800">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {["Waiting", "In progress", "On hold", "Completed"].map(
                      (status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleStatusUpdate(selectedTask._id, status)
                          }
                          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                          ${
                            selectedTask.status === status
                              ? "bg-teal-600 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                          disabled={selectedTask.status === status}
                        >
                          {status}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-between items-center">
              {userRole === "coordinator" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      router.push(
                        `/coordinator_panel/addTask?edit=${selectedTask._id}`
                      );
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <FiEdit2 className="w-4 h-4" />
                    Edit Task
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you want to delete this task?"
                        )
                      ) {
                        handleDeleteTask(selectedTask._id);
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors ml-auto"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
