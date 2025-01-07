const getCoordinatorsList = require("./getCoordinatorsList.js");
const { authenticateToken } = require("../../userAuth/authenticateToken.js");
const logAction = require("../../logs/logAction.js");

function getCoordinatorsRoute(app, client) {
  app.get("/api/coordinators", authenticateToken, async (req, res) => {
    try {
      const coordinators = await getCoordinatorsList(client);
      logAction(req.user.surname, "getCoordinatorsRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(coordinators);
    } catch (error) {
      console.error("Error fetching coordinators:", error);
      logAction(req.user.surname, "getCoordinatorsRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
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
      logAction(req.user.surname, "getCoordinatorByIdRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(coordinators);
    } catch (error) {
      logAction(req.user.surname, "getCoordinatorByIdRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
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
      logAction(req.user.surname, "getCoordinatorBySurnameRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json(drivers);
    } catch (error) {
      logAction(req.user.surname, "getCoordinatorBySurnameRoute", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: `${error}`,
      });
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
