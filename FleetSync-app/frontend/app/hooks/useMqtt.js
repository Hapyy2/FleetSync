"use client";

import { useEffect, useState, useCallback } from "react";
import mqtt from "mqtt";

const MQTT_OPTIONS = {
  keepalive: 30,
  protocol: "ws",
  protocolVersion: 4,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  rejectUnauthorized: false,
  clientId: "fleetsync_frontend_" + Math.random().toString(16).substring(2, 8),
};

export function useMqtt() {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 5;

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;

    try {
      const mqttClient = mqtt.connect("ws://localhost:8000/mqtt", {
        ...MQTT_OPTIONS,
        protocol: "ws",
        path: "/mqtt",
      });

      mqttClient.on("connect", () => {
        console.log("MQTT Connected successfully");
        setIsConnected(true);
        setError(null);
        setRetryCount(0);

        mqttClient.subscribe("fleetsync/faults/#", (err) => {
          if (err) {
            console.error("Subscription error:", err);
            setError("Failed to subscribe to topics");
          }
        });
      });

      mqttClient.on("error", (err) => {
        console.error("MQTT Error:", err);
        setError(err.message);
      });

      mqttClient.on("close", () => {
        console.log("MQTT Connection closed");
        setIsConnected(false);
      });

      mqttClient.on("offline", () => {
        console.log("MQTT Client went offline");
        setIsConnected(false);
      });

      mqttClient.on("reconnect", () => {
        console.log("Attempting to reconnect...");
        setRetryCount((prev) => {
          const newCount = prev + 1;
          if (newCount > maxRetries) {
            mqttClient.end(true);
            setError("Maximum reconnection attempts reached");
            return prev;
          }
          return newCount;
        });
      });

      setClient(mqttClient);

      return mqttClient;
    } catch (err) {
      console.error("MQTT Connection error:", err);
      setError(err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const mqttClient = connect();

    return () => {
      if (mqttClient) {
        console.log("Cleaning up MQTT connection");
        mqttClient.end(true);
      }
    };
  }, [connect]);

  const publish = useCallback(
    (topic, message) => {
      if (client && isConnected) {
        try {
          client.publish(topic, JSON.stringify(message), { qos: 1 });
        } catch (err) {
          console.error("Publish error:", err);
          setError("Failed to publish message");
        }
      }
    },
    [client, isConnected]
  );

  const subscribe = useCallback(
    (topic, callback) => {
      if (client && isConnected) {
        try {
          client.subscribe(topic, { qos: 1 });
          client.on("message", (receivedTopic, message) => {
            if (topic === receivedTopic) {
              try {
                const parsedMessage = JSON.parse(message.toString());
                callback(parsedMessage);
              } catch (err) {
                console.error("Message parsing error:", err);
              }
            }
          });
        } catch (err) {
          console.error("Subscribe error:", err);
          setError("Failed to subscribe to topic");
        }
      }
    },
    [client, isConnected]
  );

  return {
    client,
    isConnected,
    error,
    publish,
    subscribe,
    connect: () => {
      if (retryCount <= maxRetries) {
        connect();
      }
    },
  };
}
