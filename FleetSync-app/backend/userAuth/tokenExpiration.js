const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./authenticateToken.js");

function tokenExpiration(app, client) {
  app.get("/token/expiration", authenticateToken, (req, res) => {
    try {
      const accessToken = req.cookies.accessToken;
      if (!accessToken) {
        return res.status(401).json({ message: "Access token not found" });
      }

      const payload = jwt.decode(accessToken);
      res.status(200).json({ exp: payload.exp }); // Return the `exp` claim
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });
}

module.exports = {
  tokenExpiration,
};
