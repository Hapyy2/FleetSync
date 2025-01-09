const getTasksList = require("./getTasksList.js");
const createTask = require("./createTask.js");
const deleteTask = require("./deleteTask.js");
const updateTask = require("./updateTask.js");
const { authenticateToken } = require("../../userAuth/authenticateToken.js");
const simpleLog = require("../../logs/simpleLog.js");

function getTasksRoute(app, client) {
  app.get("/api/tasks", authenticateToken, async (req, res) => {
    try {
      const tasks = await getTasksList(client);
      simpleLog(req, "getTasksRoute", "successful");
      res.status(200).json(tasks);
    } catch (error) {
      simpleLog(req, "getTasksRoute", "failed", error);
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getTaskByIdRoute(app, client) {
  app.get("/api/tasks/id", authenticateToken, async (req, res) => {
    try {
      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ message: "Id parameter is required" });
      }
      const tasks = await getTasksList(client, id);
      simpleLog(req, "getTaskByIdRoute", "successful");
      res.status(200).json(tasks);
    } catch (error) {
      simpleLog(req, "getTaskByIdRoute", "failed", error);
      console.error("Error fetching tasks by id:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getTaskByNameRoute(app, client) {
  app.get("/api/tasks/name", authenticateToken, async (req, res) => {
    try {
      const name = req.query.name;
      const tasks = await getTasksList(client, undefined, name);
      simpleLog(req, "getTaskByNameRoute", "successful");
      res.status(200).json(tasks);
    } catch (error) {
      simpleLog(req, "getTaskByNameRoute", "failed", error);
      console.error("Error fetching tasks by name:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function createTaskRoute(app, client) {
  app.post("/api/tasks/create", authenticateToken, async (req, res) => {
    try {
      const task = req.body;
      if (!task) {
        return res.status(400).json({ message: "Missing the task data" });
      }
      const input = await createTask(client, task);
      simpleLog(req, "createTaskRoute", "successful");
      res.status(input.status).json(input.message);
    } catch (error) {
      simpleLog(req, "createTaskRoute", "failed", error);
      console.error("Error creating a new task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function deleteTaskRoute(app, client) {
  app.delete("/api/tasks/:id", authenticateToken, async (req, res) => {
    try {
      const taskId = req.params.id;
      if (!taskId) {
        return res.status(400).json({ message: "Task ID is required" });
      }
      const result = await deleteTask(client, taskId);
      simpleLog(req, "deleteTaskRoute", "successful");
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      simpleLog(req, "deleteTaskRoute", "failed", error);
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function updateTaskRoute(app, client) {
  app.patch("/api/tasks/:id", authenticateToken, async (req, res) => {
    try {
      const taskId = req.params.id;
      const { field, value } = req.body;
      if (!taskId || !field || !value) {
        return res.status(400).json({ message: "Invalid request data." });
      }
      const result = await updateTask(client, taskId, field, value);
      simpleLog(req, "updateTaskRoute", "successful");
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      simpleLog(req, "updateTaskRoute", "failed", error);
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

module.exports = {
  getTasksRoute,
  getTaskByIdRoute,
  createTaskRoute,
  deleteTaskRoute,
  updateTaskRoute,
  getTaskByNameRoute,
};
