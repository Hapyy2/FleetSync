const dotenv = require("dotenv");
dotenv.config();
const path = require("path");

const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend/public")));

const { MongoClient } = require("mongodb");
const uri = process.env.DB_CONNECTION;
const client = new MongoClient(uri);

const { getDrivers } = require("./CRUD/read.js");

app.get("/api/drivers", async (req, res) => {
  try {
    const drivers = await getDrivers(client);
    res.status(200).json(drivers); // Send data as JSON
  } catch (error) {
    console.error("Error fetching drivers:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/public/index.html"));
});

module.exports = app;
