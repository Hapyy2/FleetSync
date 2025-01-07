const getTrucksList = require("./getTrucksList.js");
const createTruck = require("./createTruck.js");
const deleteTruck = require("./deleteTruck.js");
const updateTruck = require("./updateTruck.js");
const { authenticateToken } = require("../../userAuth/authenticateToken.js");
const logAction = require("../../logs/logAction.js");

function getTrucksRoute(app, client) {
  app.get("/api/trucks", authenticateToken, async (req, res) => {
    try {
      const trucks = await getTrucksList(client);
      logAction(req.user.surname, "getTrucksRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(trucks);
    } catch (error) {
      logAction(req.user.surname, "getTrucksRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error fetching trucks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getTruckByIdRoute(app, client) {
  app.get("/api/trucks/id", authenticateToken, async (req, res) => {
    try {
      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ message: "Id parameter is required" });
      }
      const trucks = await getTrucksList(client, id);
      logAction(req.user.surname, "getTruckByIdRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(trucks);
    } catch (error) {
      logAction(req.user.surname, "getTruckByIdRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error fetching trucks by id:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getTruckByLicensePlateRoute(app, client) {
  app.get("/api/trucks/licenseplate", authenticateToken, async (req, res) => {
    try {
      const licensePlate = req.query.licensePlate;
      const trucks = await getTrucksList(client, undefined, licensePlate);
      logAction(req.user.surname, "getTruckByLicensePlateRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(trucks);
    } catch (error) {
      logAction(req.user.surname, "getTruckByLicensePlateRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error fetching trucks by license plate:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function createTruckRoute(app, client) {
  app.post("/api/trucks/create", authenticateToken, async (req, res) => {
    try {
      const truck = req.body;
      if (!truck) {
        return res.status(400).json({ message: "Missing the truck data" });
      }
      const input = await createTruck(client, truck);
      logAction(req.user.surname, "createTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(input.status).json(input.message);
    } catch (error) {
      logAction(req.user.surname, "createTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error creating a new truck:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function deleteTruckRoute(app, client) {
  app.delete("/api/trucks/:id", authenticateToken, async (req, res) => {
    try {
      const truckId = req.params.id;
      if (!truckId) {
        return res.status(400).json({ message: "Truck ID is required" });
      }
      const result = await deleteTruck(client, truckId);
      logAction(req.user.surname, "deleteTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      logAction(req.user.surname, "deleteTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error deleting truck:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function updateTruckRoute(app, client) {
  app.patch("/api/trucks/:id", authenticateToken, async (req, res) => {
    try {
      const truckId = req.params.id;
      const { field, value } = req.body;
      if (!truckId || !field || !value) {
        return res.status(400).json({ message: "Invalid request data." });
      }
      const result = await updateTruck(client, truckId, field, value);
      logAction(req.user.surname, "updateTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      logAction(req.user.surname, "updateTruckRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
      console.error("Error updating truck:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

module.exports = {
  getTrucksRoute,
  getTruckByIdRoute,
  createTruckRoute,
  deleteTruckRoute,
  updateTruckRoute,
  getTruckByLicensePlateRoute,
};
