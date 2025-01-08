const { authenticateToken } = require("./authenticateToken.js");
const simpleLog = require("../logs/simpleLog.js");

function logoutUser(app, client) {
  app.delete("/logout", authenticateToken, async (req, res) => {
    try {
      const refreshToken = req.body.token;
      if (refreshToken == null) return res.sendStatus(401);
      const db = client.db("transportCompany");
      const coll = db.collection("tokens");
      await coll.deleteOne({ token: refreshToken });
      simpleLog(req, "logout", "successful");
      res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      simpleLog(req, "logout", "failed", "Internal server error");
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = {
  logoutUser,
};
