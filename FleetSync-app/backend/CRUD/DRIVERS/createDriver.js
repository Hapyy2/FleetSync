const bcrypt = require("bcrypt");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

function checkData(driver) {
  const requiredKeys = [
    "name",
    "surname",
    "birthdate",
    "email",
    "phone",
    "password",
  ];
  const allRequiredKeysExist = requiredKeys.every((key) => key in driver);

  if (allRequiredKeysExist) {
    if (!("fullAddress" in driver)) {
      driver.fullAddress = undefined;
    }
    if (!("status" in driver)) {
      driver.status = "offline";
    }
    if (!("employmentDate" in driver)) {
      driver.employmentDate = new Date();
    }
    return 200;
  } else {
    return 400;
  }
}

async function createDriver(client, doc) {
  const db = client.db("transportCompany");
  const coll = db.collection("drivers");

  const checkResult = checkData(doc);
  if (checkResult === 400) {
    return { status: 400, message: "Missing required data" };
  } else {
    doc["password"] = await hashPassword(doc["password"]);
    const result = await coll.insertOne(doc);
    return { status: 200, message: "Driver created", result: result };
  }
}

module.exports = createDriver;
