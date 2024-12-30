const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

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

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

module.exports = app;
