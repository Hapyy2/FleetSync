const getDriversList = require("./getDriversList.js");

function checkData(field) {
  const validKeys = [
    "name",
    "surname",
    "birthDate",
    "email",
    "phone",
    "fullAddress",
    "status",
  ];
  return validKeys.includes(field) ? 200 : 400;
}

async function updateDriver(client, id, field, value) {
  const db = client.db("transportCompany");
  const coll = db.collection("drivers");

  const findResult = await getDriversList(client, id);
  const checkResult = checkData(field);
  if (checkResult === 400) {
    return { status: 400, message: "Invalid data" };
  }
  if (findResult.length == 1) {
    const updateQuery = { $set: { [field]: value } };
    const result = await coll.updateOne(findResult[0], updateQuery);
    return { status: 200, message: "Driver updated", result: result };
  } else {
    return { status: 400, message: "Could not find the driver" };
  }
}

module.exports = updateDriver;
