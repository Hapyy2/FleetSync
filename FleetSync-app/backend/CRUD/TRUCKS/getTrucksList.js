const { ObjectId } = require("mongodb");

async function getTrucksList(client, id) {
  const db = client.db("transportCompany");
  const coll = db.collection("trucks");

  let cursor;

  if (id) {
    cursor = coll.find({ _id: new ObjectId(id) });
  } else {
    cursor = coll.find();
  }

  const result = await cursor.toArray();
  return result;
}

module.exports = getTrucksList;
