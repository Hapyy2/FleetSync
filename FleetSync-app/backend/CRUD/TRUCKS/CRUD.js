const getTrucksList = require("./getTrucksList.js");
const createTruck = require("./createTruck.js");
const deleteTruck = require("./deleteTruck.js");
const updateTruck = require("./updateTruck.js");

function getTrucksRoute(app, client) {
  app.get("/api/trucks", async (req, res) => {
    try {
      const trucks = await getTrucksList(client);
      res.status(200).json(trucks);
    } catch (error) {
      console.error("Error fetching trucks:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getTruckByIdRoute(app, client) {
  app.get("/api/trucks/id", async (req, res) => {
    try {
      const id = req.query.id;
      if (!id) {
        return res.status(400).json({ message: "Id parameter is required" });
      }
      const trucks = await getTrucksList(client, id);
      res.status(200).json(trucks);
    } catch (error) {
      console.error("Error fetching trucks by surname:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function createTruckRoute(app, client) {
  app.post("/api/trucks/create", async (req, res) => {
    try {
      const truck = req.body;
      if (!truck) {
        return res.status(400).json({ message: "Missing the truck data" });
      }
      const input = await createTruck(client, truck);
      res.status(input.status).json(input.message);
    } catch (error) {
      console.error("Error creating a new truck:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function deleteTruckRoute(app, client) {
  app.delete("/api/trucks/:id", async (req, res) => {
    try {
      const truckId = req.params.id;
      if (!truckId) {
        return res.status(400).json({ message: "Truck ID is required" });
      }
      const result = await deleteTruck(client, truckId);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error deleting truck:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function updateTruckRoute(app, client) {
  app.patch("/api/trucks/:id", async (req, res) => {
    try {
      const truckId = req.params.id;
      const { field, value } = req.body;

      if (!truckId || !field || !value) {
        return res.status(400).json({ message: "Invalid request data." });
      }

      const result = await updateTruck(client, truckId, field, value);
      res.status(result.status).json({ message: result.message });
    } catch (error) {
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
};
