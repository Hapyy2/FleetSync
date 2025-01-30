"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useMqtt } from "@/app/hooks/useMqtt";

export default function FaultReportForm() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [socket, setSocket] = useState(null);
  const { publish, isConnected: isMqttConnected, error: mqttError } = useMqtt();
  const [connectionStatus, setConnectionStatus] = useState({
    socket: false,
    mqtt: false,
  });

  useEffect(() => {
    setConnectionStatus((prev) => ({
      ...prev,
      mqtt: isMqttConnected,
    }));
  }, [isMqttConnected]);

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
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
      setConnectionStatus((prev) => ({
        ...prev,
        socket: false,
      }));
    });

    newSocket.on("faultReportSuccess", (response) => {
      setMessage({
        type: "success",
        text: response.message || "Fault reported successfully",
      });
      setSubmitting(false);
      if (response.success) {
        setTopic("");
        setDescription("");
      }
    });

    newSocket.on("error", (error) => {
      setMessage({ type: "error", text: error.message || "An error occurred" });
      setSubmitting(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connectionStatus.socket && !connectionStatus.mqtt) {
      setMessage({
        type: "error",
        text: "No connection available. Please wait for reconnection.",
      });
      return;
    }

    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      const faultData = {
        topic,
        description,
        createdAt: new Date(),
        status: "pending",
      };

      if (connectionStatus.mqtt) {
        publish("fleetsync/faults/new", faultData);
      }

      if (connectionStatus.socket && socket) {
        socket.emit("reportFault", faultData);
      }

      setMessage({
        type: "success",
        text: "Fault report submitted",
      });

      setTopic("");
      setDescription("");
    } catch (error) {
      console.error("Error submitting fault:", error);
      setMessage({
        type: "error",
        text: "Failed to report fault. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Report a Fault</h2>

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

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Fault Topic
          </label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            placeholder="e.g., Engine Issue, Brake Problem"
            required
            disabled={submitting}
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border rounded-md h-32 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            placeholder="Please describe the fault in detail..."
            required
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          disabled={
            submitting || (!connectionStatus.socket && !connectionStatus.mqtt)
          }
          className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
            ${
              submitting || (!connectionStatus.socket && !connectionStatus.mqtt)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          {submitting ? "Submitting..." : "Report Fault"}
        </button>
      </form>
    </div>
  );
}
