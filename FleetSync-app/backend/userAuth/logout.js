const { authenticateToken } = require("./authenticateToken.js");
const logAction = require("../logs/logAction.js");

function logoutUser(app, client) {
  app.delete("/logout", authenticateToken, async (req, res) => {
    try {
      const refreshToken = req.body.token;
      if (refreshToken == null) return res.sendStatus(401);
      const db = client.db("transportCompany");
      const coll = db.collection("tokens");
      await coll.deleteOne({ token: refreshToken });
      logAction(req.user.surname, "logout", {
        username: req.user.surname,
        role: req.user.role,
        status: "successful",
      });
      res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      logAction(req.user.surname, "logout", {
        username: req.user.surname,
        role: req.user.role,
        status: "failed",
        reason: "Internal server error",
      });
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = {
  logoutUser,
};
