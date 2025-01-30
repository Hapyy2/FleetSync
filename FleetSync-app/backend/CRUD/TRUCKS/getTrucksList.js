const { ObjectId } = require("mongodb");

async function getTrucksList(client, id, licensePlate) {
  const db = client.db("transportCompany");
  const coll = db.collection("trucks");

  let cursor;

  if (id) {
    console.log(id);
    cursor = coll.find({ _id: new ObjectId(id) });
  } else if (licensePlate) {
    cursor = coll.find({
      licensePlate: { $regex: licensePlate, $options: "i" },
    });
  } else {
    cursor = coll.find();
  }

  const result = await cursor.toArray();
  return result;
}

module.exports = getTrucksList;
