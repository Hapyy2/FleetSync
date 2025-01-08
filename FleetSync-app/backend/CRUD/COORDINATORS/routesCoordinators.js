const getCoordinatorsList = require("./getCoordinatorsList.js");
const { authenticateToken } = require("../../userAuth/authenticateToken.js");
const simpleLog = require("../../logs/simpleLog.js");

function getCoordinatorsRoute(app, client) {
  app.get("/api/coordinators", authenticateToken, async (req, res) => {
    try {
      const coordinators = await getCoordinatorsList(client);
      simpleLog(req, "getCoordinatorsRoute", "successful");
      res.status(200).json(coordinators);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
      simpleLog(req, "getCoordinatorsRoute", "failed", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getCoordinatorByIdRoute(app, client) {
  app.get("/api/coordinators/:id", authenticateToken, async (req, res) => {
    try {
      const coordinatorId = req.params.id;
      if (!coordinatorId) {
        return res.status(400).json({ message: "Driver ID is required" });
      }
      const coordinators = await getCoordinatorsList(client, coordinatorId);
      simpleLog(req, "getCoordinatorByIdRoute", "successful");
      res.status(200).json(coordinators);
    } catch (error) {
      simpleLog(req, "getCoordinatorByIdRoute", "failed", error);
      console.error("Error fetching drivers by surname:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

function getCoordinatorBySurnameRoute(app, client) {
  app.get("/api/coordinators/surname", authenticateToken, async (req, res) => {
    try {
      const surname = req.query.surname;
      if (!surname) {
        return res
          .status(400)
          .json({ message: "Surname parameter is required" });
      }
      const drivers = await getDriversList(client, undefined, surname);
      simpleLog(req, "getCoordinatorBySurnameRoute", "successful");
      res.status(200).json(drivers);
    } catch (error) {
      simpleLog(req, "getCoordinatorBySurnameRoute", "failed", error);
      console.error("Error fetching coordinators by surname:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

module.exports = {
  getCoordinatorsRoute,
  getCoordinatorByIdRoute,
  getCoordinatorBySurnameRoute,
};
