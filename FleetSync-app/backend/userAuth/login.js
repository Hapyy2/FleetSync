const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const getDriversList = require("../CRUD/DRIVERS/getDriversList.js");
const getCoordinatorsList = require("../CRUD/COORDINATORS/getCoordinatorsList.js");

const jwt = require("jsonwebtoken");

function generetaAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
}

function loginUser(app, client) {
  app.post("/login", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const [drivers, coordinators] = await Promise.all([
      getDriversList(client, undefined, username),
      getCoordinatorsList(client, undefined, username),
    ]);
    let user;
    let userRole;

    if (drivers.length > 0) {
      user = drivers[0];
      userRole = "driver";
    } else if (coordinators.length > 0) {
      user = coordinators[0];
      userRole = "coordinator";
    } else {
      userRole = null;
    }

    if (!user) {
      return res.status(400).json({ message: "Wrong username" });
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        const tokenUser = {
          name: user.name,
          surname: user.surname,
          role: userRole,
        };

        const accessToken = generetaAccessToken(tokenUser);
        const refreshToken = jwt.sign(
          tokenUser,
          process.env.REFRESH_TOKEN_SECRET
        );

        const doc = {
          token: refreshToken,
          user: tokenUser,
          createdAt: new Date(),
        };

        const db = client.db("transportCompany");
        const coll = db.collection("tokens");
        await coll.insertOne(doc);

        res.json({ accessToken: accessToken, refreshToken: refreshToken });
      } else {
        return res.status(401).json({ message: "Invalid Password" });
      }
    } catch (error) {
      res.status(500).json({ message: "Could not log in" });
    }
  });
}

module.exports = {
  loginUser,
};
