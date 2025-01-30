const getTrucksList = require("./getTrucksList.js");

async function deleteTruck(client, id) {
  const db = client.db("transportCompany");
  const coll = db.collection("trucks");

  const findResult = await getTrucksList(client, id);

  console.log(findResult);

  if (findResult.length == 1) {
    const result = await coll.deleteOne(findResult[0]);
    return { status: 200, message: "Truck deleted", result: result };
  } else {
    return { status: 400, message: "Could not delete the truck" };
  }
}

module.exports = deleteTruck;
