const { ObjectId } = require("mongodb");

function taskHandlers(socket, io, activeConnections, client) {
  const db = client.db("transportCompany");
  const tasksCollection = db.collection("tasks");

  async function emitUpdatedTasks(userId = null) {
    let tasks;

    if (userId) {
      tasks = await tasksCollection
        .find({
          "driver.email": socket.user.email,
        })
        .toArray();
    } else {
      tasks = await tasksCollection.find({}).toArray();
    }

    if (socket.user.role === "driver") {
      socket.emit("taskUpdate", tasks);
    } else {
      io.emit("taskUpdate", tasks);
    }
  }

  socket.on("searchTasks", async ({ searchTerm }) => {
    try {
      let query = {
        name: { $regex: searchTerm, $options: "i" },
      };

      if (socket.user.role === "driver") {
        query["driver.email"] = socket.user.email;
      }

      const tasks = await tasksCollection.find(query).toArray();
      socket.emit("searchResults", tasks);
    } catch (error) {
      socket.emit("error", { message: "Error searching tasks" });
    }
  });

  socket.on("updateTaskStatus", async ({ taskId, newStatus }) => {
    try {
      if (socket.user.role !== "coordinator") {
        throw new Error("Unauthorized to update task status");
      }

      const validStatuses = ["Waiting", "In progress", "On hold", "Completed"];
      if (!validStatuses.includes(newStatus)) {
        throw new Error("Invalid status");
      }

      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(taskId) },
        { $set: { status: newStatus } }
      );

      if (result.modifiedCount === 0) {
        throw new Error("Task not found");
      }

      await emitUpdatedTasks();
      socket.emit("statusUpdateSuccess", { taskId, newStatus });
    } catch (error) {
      socket.emit("error", {
        message: error.message || "Error updating task status",
      });
    }
  });

  socket.on("requestInitialTasks", async () => {
    await emitUpdatedTasks(
      socket.user.role === "driver" ? socket.user.id : null
    );
  });

  socket.on("subscribeToTaskUpdates", async () => {
    try {
      await emitUpdatedTasks(
        socket.user.role === "driver" ? socket.user.id : null
      );
    } catch (error) {
      socket.emit("error", { message: "Error subscribing to task updates" });
    }
  });
}

module.exports = taskHandlers;
