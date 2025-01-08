const { authenticateToken } = require("./authenticateToken.js");

function logoutUser(app, client) {
  app.delete("/logout", authenticateToken, async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (refreshToken == null) return res.sendStatus(401);
      const db = client.db("transportCompany");
      const coll = db.collection("tokens");
      await coll.deleteOne({ token: refreshToken });
      res.status(200).json({ message: "Logout successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = {
  logoutUser,
};
