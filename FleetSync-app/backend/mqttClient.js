// mqttClient.js
const mqtt = require("mqtt");

class MQTTClient {
  constructor() {
    this.client = null;
  }

  connect() {
    if (this.client) return;

    this.client = mqtt.connect("mqtt://localhost:1883"); // or your HiveMQ address

    this.client.on("connect", () => {
      console.log("MQTT Connected");
      this.client.subscribe("fleetsync/faults/#");
    });

    this.client.on("error", (error) => {
      console.error("MQTT Error:", error);
    });
  }

  publish(topic, message) {
    if (this.client) {
      this.client.publish(topic, JSON.stringify(message));
    }
  }

  onMessage(callback) {
    if (this.client) {
      this.client.on("message", callback);
    }
  }
}

// Create and export a singleton instance
const mqttClient = new MQTTClient();
module.exports = mqttClient;
