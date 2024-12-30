function checkData(driver) {
  const requiredKeys = ["name", "surname", "birthdate", "email", "phone"];
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
    const result = await coll.insertOne(doc);
    return { status: 200, message: "Driver created", result: result };
  }
}

module.exports = createDriver;
