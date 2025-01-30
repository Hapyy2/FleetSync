"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useMqtt } from "@/app/hooks/useMqtt";

export default function FaultManagement() {
  const [faults, setFaults] = useState({ pending: [], resolved: [] });
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const {
    subscribe,
    isConnected: isMqttConnected,
    error: mqttError,
  } = useMqtt();
  const [connectionStatus, setConnectionStatus] = useState({
    socket: false,
    mqtt: false,
  });

  // Update MQTT connection status when it changes
  useEffect(() => {
    setConnectionStatus((prev) => ({
      ...prev,
      mqtt: isMqttConnected,
    }));
  }, [isMqttConnected]);

  // Socket.IO setup
  useEffect(() => {
    const newSocket = io("https://localhost:3000", {
      withCredentials: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected");
      setConnectionStatus((prev) => ({
        ...prev,
        socket: true,
      }));
      newSocket.emit("requestFaults");
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnectionStatus((prev) => ({
        ...prev,
        socket: false,
      }));
    });

    newSocket.on("faultsList", (faultsList) => {
      const pending = faultsList.filter((f) => f.status === "pending");
      const resolved = faultsList.filter((f) => f.status === "resolved");
      setFaults({ pending, resolved });
      setLoading(false);
    });

    newSocket.on("newFault", (fault) => {
      setFaults((prev) => ({
        ...prev,
        pending: [...prev.pending, fault],
      }));
      setMessage({ type: "info", text: "New fault reported" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    });

    newSocket.on("error", (error) => {
      setMessage({ type: "error", text: error.message || "An error occurred" });
      setTimeout(() => setMessage({ type: "", text: "" }), 5000);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  // MQTT subscription setup
  useEffect(() => {
    if (isMqttConnected) {
      subscribe("fleetsync/faults/new", (fault) => {
        setFaults((prev) => ({
          ...prev,
          pending: [...prev.pending, fault],
        }));
      });

      subscribe("fleetsync/faults/status", (update) => {
        setFaults((prev) => {
          const updatedPending = prev.pending.filter(
            (f) => f._id !== update.faultId
          );
          const movedFault = prev.pending.find((f) => f._id === update.faultId);

          if (movedFault) {
            const updatedFault = { ...movedFault, status: update.status };
            return {
              pending: updatedPending,
              resolved: [...prev.resolved, updatedFault],
            };
          }
          return prev;
        });
      });
    }
  }, [isMqttConnected, subscribe]);

  const handleStatusUpdate = (faultId) => {
    if (!socket || !connectionStatus.socket) {
      setMessage({
        type: "error",
        text: "No connection available. Please try again.",
      });
      return;
    }

    socket.emit("updateFaultStatus", { faultId, status: "resolved" });
  };

  const ConnectionStatus = () => (
    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              connectionStatus.socket ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            Socket: {connectionStatus.socket ? "Connected" : "Disconnected"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              connectionStatus.mqtt ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-600">
            MQTT: {connectionStatus.mqtt ? "Connected" : "Disconnected"}
          </span>
        </div>
        {mqttError && (
          <div className="text-sm text-red-600 mt-1">
            MQTT Error: {mqttError}
          </div>
        )}
      </div>
    </div>
  );

  const FaultCard = ({ fault, isPending }) => (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-800">{fault.topic}</h3>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            isPending
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {isPending ? "Pending" : "Resolved"}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 whitespace-pre-wrap">
        {fault.description}
      </p>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        <div className="flex justify-between items-center">
          <span>Reported by:</span>
          <span className="font-medium text-gray-700">
            {fault.driver?.name} {fault.driver?.surname}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span>Date:</span>
          <span className="font-medium text-gray-700">
            {new Date(fault.createdAt).toLocaleString()}
          </span>
        </div>
      </div>

      {isPending && (
        <button
          onClick={() => handleStatusUpdate(fault._id)}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Mark as Resolved
        </button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Fault Management</h2>

      <ConnectionStatus />

      {message.text && (
        <div
          className={`p-4 rounded-lg ${
            message.type === "error"
              ? "bg-red-100 text-red-700"
              : message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Pending Faults
        </h3>
        {faults.pending.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
            No pending faults
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faults.pending.map((fault) => (
              <FaultCard key={fault._id} fault={fault} isPending={true} />
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Resolved Faults
        </h3>
        {faults.resolved.length === 0 ? (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-lg">
            No resolved faults
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {faults.resolved.map((fault) => (
              <FaultCard key={fault._id} fault={fault} isPending={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
