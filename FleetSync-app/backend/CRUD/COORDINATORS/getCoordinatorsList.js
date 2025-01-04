const { ObjectId } = require("mongodb");

async function getCoordinatorsList(client, id, surname) {
  const db = client.db("transportCompany");
  const coll = db.collection("coordinators");

  let cursor;

  if (id) {
    cursor = coll.find({ _id: new ObjectId(id) });
  } else if (surname) {
    cursor = coll.find({ surname: `${surname}` });
  } else {
    cursor = coll.find();
  }

  const result = await cursor.toArray();
  return result;
}

module.exports = getCoordinatorsList;
