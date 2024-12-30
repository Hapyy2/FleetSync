const getCoordinatorsList = require("./getCoordinatorsList.js");

function getCoordinatorsRoute(app, client) {
  app.get("/api/coordinators", async (req, res) => {
    try {
      const coordinators = await getCoordinatorsList(client);
      res.status(200).json(coordinators);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getCoordinatorByIdRoute(app, client) {
  app.get("/api/coordinators/:id", async (req, res) => {
    try {
      const coordinatorId = req.params.id;
      if (!coordinatorId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }
      const coordinators = await getCoordinatorsList(client, coordinatorId);
      res.status(200).json(coordinators);
    } catch (error) {
      console.error("Error fetching drivers by surname:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

module.exports = {
  getCoordinatorsRoute,
  getCoordinatorByIdRoute,
};
