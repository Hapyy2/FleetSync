// Reading enviroment variables
const dotenv = require("dotenv");
dotenv.config();

// Setting up app
const path = require("path");
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Enabling connection with the frontend (Cross-Origin Resource Sharing)
const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  })
);

// Managing cookies
const cookieParser = require("cookie-parser");
app.use(cookieParser());

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
  getTruckByLicensePlateRoute,
} = require("./CRUD/TRUCKS/CRUD.js");
getTrucksRoute(app, client);
getTruckByIdRoute(app, client);
createTruckRoute(app, client);
deleteTruckRoute(app, client);
updateTruckRoute(app, client);
getTruckByLicensePlateRoute(app, client);

// Routes for coordinators read
const {
  getCoordinatorsRoute,
  getCoordinatorByIdRoute,
  getCoordinatorBySurnameRoute,
} = require("./CRUD/COORDINATORS/routesCoordinators.js");
getCoordinatorsRoute(app, client);
getCoordinatorByIdRoute(app, client);
getCoordinatorBySurnameRoute(app, client);

// Routes for tasks CRUD
const {
  getTasksRoute,
  getTaskByIdRoute,
  createTaskRoute,
  deleteTaskRoute,
  updateTaskRoute,
  getTaskByNameRoute,
} = require("./CRUD/TASKS/CRUD.js");
getTasksRoute(app, client);
getTaskByIdRoute(app, client);
createTaskRoute(app, client);
deleteTaskRoute(app, client);
updateTaskRoute(app, client);
getTaskByNameRoute(app, client);

// Routes for user login and auth
const { loginUser } = require("./userAuth/login.js");
const { refreshToken } = require("./userAuth/refreshToken.js");
const { logoutUser } = require("./userAuth/logout.js");
const { tokenExpiration } = require("./userAuth/tokenExpiration.js");
loginUser(app, client);
refreshToken(app, client);
logoutUser(app, client);
tokenExpiration(app, client);

// Route for main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

module.exports = app;
