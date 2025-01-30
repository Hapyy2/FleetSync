const mqtt = require("mqtt");
const { ObjectId } = require("mongodb");

function faultHandlers(socket, io, activeConnections, client) {
  const db = client.db("transportCompany");
  const faultsCollection = db.collection("faults");

  const mqttClient = mqtt.connect("mqtt://localhost:1883");

  mqttClient.on("connect", () => {
    console.log("MQTT Connected");
    mqttClient.subscribe("fleetsync/faults/#");
  });

  mqttClient.on("message", async (topic, message) => {
    if (topic === "fleetsync/faults/status") {
      const data = JSON.parse(message);
      await emitUpdatedFaults();
    }
  });

  async function emitUpdatedFaults() {
    try {
      const faults = await faultsCollection.find({}).toArray();
      const coordinatorConnections = Array.from(
        activeConnections.values()
      ).filter((conn) => conn.user.role === "coordinator");

      coordinatorConnections.forEach((conn) => {
        io.to(conn.socketId).emit("faultsList", faults);
      });

      const driverConnections = Array.from(activeConnections.values()).filter(
        (conn) => conn.user.role === "driver"
      );

      driverConnections.forEach(async (conn) => {
        const driverFaults = faults.filter(
          (fault) => fault.driver.id === conn.user.id
        );
        io.to(conn.socketId).emit("faultsList", driverFaults);
      });
    } catch (error) {
      console.error("Error emitting faults:", error);
    }
  }

  socket.on("reportFault", async (faultData) => {
    try {
      const fault = {
        ...faultData,
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date(),
        driver: {
          id: socket.user.id,
          name: socket.user.name,
          surname: socket.user.surname,
        },
      };

      const result = await faultsCollection.insertOne(fault);

      mqttClient.publish(
        "fleetsync/faults/new",
        JSON.stringify({
          ...fault,
          _id: result.insertedId,
        })
      );

      await emitUpdatedFaults();

      socket.emit("faultReportSuccess", {
        message: "Fault reported successfully",
      });
    } catch (error) {
      console.error("Error reporting fault:", error);
      socket.emit("error", { message: "Failed to report fault" });
    }
  });

  socket.on("updateFaultStatus", async ({ faultId, status }) => {
    try {
      if (socket.user.role !== "coordinator") {
        throw new Error("Unauthorized to update fault status");
      }

      const result = await faultsCollection.updateOne(
        { _id: new ObjectId(faultId) },
        {
          $set: {
            status,
            updatedAt: new Date(),
          },
        }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Fault not found");
      }

      mqttClient.publish(
        "fleetsync/faults/status",
        JSON.stringify({
          faultId,
          status,
          updatedBy: {
            id: socket.user.id,
            name: socket.user.name,
            surname: socket.user.surname,
          },
        })
      );

      await emitUpdatedFaults();
      socket.emit("statusUpdateSuccess", { faultId, status });
    } catch (error) {
      socket.emit("error", {
        message: error.message || "Error updating fault status",
      });
    }
  });

  socket.on("requestFaults", async () => {
    try {
      let faults;
      if (socket.user.role === "coordinator") {
        faults = await faultsCollection.find({}).toArray();
      } else {
        faults = await faultsCollection
          .find({ "driver.id": socket.user.id })
          .toArray();
      }
      socket.emit("faultsList", faults);
    } catch (error) {
      socket.emit("error", { message: "Error fetching faults" });
    }
  });

  socket.on("disconnect", () => {
    mqttClient.end();
  });
}

module.exports = faultHandlers;
