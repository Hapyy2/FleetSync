const getTrucksList = require("./getTrucksList.js");

function checkData(field) {
  const validKeys = [
    "model",
    "mileage",
    "fuel",
    "maxFuel",
    "status",
    "currentDriver",
  ];
  return validKeys.includes(field) ? 200 : 400;
}

async function updateTruck(client, id, field, value) {
  const db = client.db("transportCompany");
  const coll = db.collection("trucks");

  const findResult = await getTrucksList(client, id);
  const checkResult = checkData(field);
  if (checkResult === 400) {
    return { status: 400, message: "Invalid data" };
  }
  if (findResult.length == 1) {
    const updateQuery = { $set: { [field]: value } };
    const result = await coll.updateOne(findResult[0], updateQuery);
    return { status: 200, message: "Truck updated", result: result };
  } else {
    return { status: 400, message: "Could not find the truck" };
  }
}

module.exports = updateTruck;
