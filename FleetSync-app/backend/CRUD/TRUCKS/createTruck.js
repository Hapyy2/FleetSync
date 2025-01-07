function checkData(truck) {
  const requiredKeys = ["licensePlate", "model", "mileage", "maxFuel"];
  const allRequiredKeysExist = requiredKeys.every((key) => key in truck);

  if (allRequiredKeysExist) {
    if (!("fuel" in truck)) {
      truck.fuel = truck.maxFuel;
    }
    if (!("status" in truck)) {
      truck.status = "operational";
    }
    if (!("currentDriver" in truck)) {
      truck.currentDriver = null;
    }
    return 200;
  } else {
    return 400;
  }
}

async function createTruck(client, doc) {
  const db = client.db("transportCompany");
  const coll = db.collection("trucks");

  const checkResult = checkData(doc);
  if (checkResult === 400) {
    return { status: 400, message: "Missing required data" };
  } else {
    const result = await coll.insertOne(doc);
    return { status: 200, message: "Truck created", result: result };
  }
}

module.exports = createTruck;
