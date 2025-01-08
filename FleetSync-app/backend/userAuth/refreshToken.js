const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");

function generetaAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30s" });
}

async function checkToken(client, refreshToken) {
  const db = client.db("transportCompany");
  const coll = db.collection("tokens");
  const found = await coll.findOne({ token: refreshToken });
  return !!found;
}

function refreshToken(app, client) {
<<<<<<< Updated upstream
  app.post("/token", async (req, res) => {
    const refreshToken = req.body.token;
=======
  app.post("/token", authenticateToken, async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

>>>>>>> Stashed changes
    if (refreshToken == null) return res.sendStatus(401);

    const isValidToken = await checkToken(client, refreshToken);
    if (!isValidToken) return res.sendStatus(403);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const accessToken = generetaAccessToken({
        name: user.name,
        surname: user.surname,
      });
<<<<<<< Updated upstream
      res.json({ accessToken: accessToken });
=======
      simpleLog(req, "refreshToken", "successful");

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
        maxAge: 10 * 60 * 1000,
      });

      res.json({ message: "New access token set in cookie" });
>>>>>>> Stashed changes
    });
  });
}

module.exports = {
  refreshToken,
};
