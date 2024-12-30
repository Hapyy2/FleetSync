const getDriversList = require("./getDriversList.js");

async function deleteDriver(client, id) {
  const db = client.db("transportCompany");
  const coll = db.collection("drivers");

  const findResult = await getDriversList(client, id);

  if (findResult.length == 1) {
    const result = await coll.deleteOne(findResult[0]);
    return { status: 200, message: "Driver deleted", result: result };
  } else {
    return { status: 400, message: "Could not delete the driver" };
  }
}

module.exports = deleteDriver;
