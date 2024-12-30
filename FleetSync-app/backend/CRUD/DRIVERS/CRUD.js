const getDriversList = require("./getDriversList.js");
const createDriver = require("./createDriver.js");
const deleteDriver = require("./deleteDriver.js");
const updateDriver = require("./updateDriver.js");

function getDriversRoute(app, client) {
  app.get("/api/drivers", async (req, res) => {
    try {
      const drivers = await getDriversList(client);
      res.status(200).json(drivers);
    } catch (error) {
      console.error("Error fetching drivers:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getDriversBySurnameRoute(app, client) {
  app.get("/api/drivers/surname", async (req, res) => {
    try {
      const surname = req.query.surname;
      if (!surname) {
        return res
          .status(400)
          .json({ message: "Surname parameter is required" });
      }
      const drivers = await getDriversList(client, undefined, surname);
      res.status(200).json(drivers);
    } catch (error) {
      console.error("Error fetching drivers by surname:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function createDriverRoute(app, client) {
  app.post("/api/drivers/create", async (req, res) => {
    try {
      const driver = req.body;
      if (!driver) {
        return res.status(400).json({ message: "Missing the driver data" });
      }
      const input = await createDriver(client, driver);
      res.status(input.status).json(input.message);
    } catch (error) {
      console.error("Error creating a new driver:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function deleteDriverRoute(app, client) {
  app.delete("/api/drivers/:id", async (req, res) => {
    try {
      const driverId = req.params.id;
      if (!driverId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }
      const result = await deleteDriver(client, driverId);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error deleting driver:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function updateDriverRoute(app, client) {
  app.patch("/api/drivers/:id", async (req, res) => {
    try {
      const driverId = req.params.id;
      const { field, value } = req.body;

      if (!driverId || !field || !value) {
        return res.status(400).json({ message: "Invalid request data." });
      }

      const result = await updateDriver(client, driverId, field, value);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error updating driver:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

module.exports = {
  getDriversRoute,
  getDriversBySurnameRoute,
  createDriverRoute,
  deleteDriverRoute,
  updateDriverRoute,
};
