const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Connecting to the database
const { MongoClient } = require("mongodb");
const uri = process.env.DB_CONNECTION;
console.log("DB_CONNECTION:", process.env.DB_CONNECTION);
console.log(uri);
const client = new MongoClient(uri);

async function startDB() {
  try {
    await client.connect();
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}
startDB();

// Routes for drivers CRUD
const {
  getDriversRoute,
  getDriversBySurnameRoute,
  createDriverRoute,
  deleteDriverRoute,
  updateDriverRoute,
} = require("./CRUD/DRIVERS/CRUD.js");
getDriversRoute(app, client);
getDriversBySurnameRoute(app, client);
createDriverRoute(app, client);
deleteDriverRoute(app, client);
updateDriverRoute(app, client);

// Routes for trucks CRUD
const {
  getTrucksRoute,
  getTruckByIdRoute,
  createTruckRoute,
  deleteTruckRoute,
  updateTruckRoute,
} = require("./CRUD/TRUCKS/CRUD.js");
getTrucksRoute(app, client);
getTruckByIdRoute(app, client);
createTruckRoute(app, client);
deleteTruckRoute(app, client);
updateTruckRoute(app, client);

// Routes for coordinators read
const {
  getCoordinatorsRoute,
  getCoordinatorByIdRoute,
} = require("./CRUD/COORDINATORS/routesCoordinators.js");
getCoordinatorsRoute(app, client);
getCoordinatorByIdRoute(app, client);

// Routes for user login and auth
const { loginUser } = require("./userAuth/login.js");
const { refreshToken } = require("./userAuth/refreshToken.js");
const { logoutUser } = require("./userAuth/logout.js");
loginUser(app, client);
refreshToken(app, client);
logoutUser(app, client);

// Route for main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

module.exports = app;
