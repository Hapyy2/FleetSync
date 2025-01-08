const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./authenticateToken.js");
const simpleLog = require("../logs/simpleLog.js");

function generetaAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

async function checkToken(client, refreshToken) {
  const db = client.db("transportCompany");
  const coll = db.collection("tokens");
  const found = await coll.findOne({ token: refreshToken });
  return !!found;
}

function refreshToken(app, client) {
  app.post("/token", authenticateToken, async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    simpleLog(req, "refreshToken", "failed", "Empty request");

    const isValidToken = await checkToken(client, refreshToken);
    if (!isValidToken) return res.sendStatus(403);
    simpleLog(req, "refreshToken", "failed", "Wrong refreshToken");

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generetaAccessToken({
        name: user.name,
        surname: user.surname,
      });
      simpleLog(req, "refreshToken", "successful");
      res.json({ accessToken: accessToken });
    });
  });
}

module.exports = {
  refreshToken,
};
