const { ObjectId } = require("mongodb");

async function getTasksList(client, id, name) {
  const db = client.db("transportCompany");
  const coll = db.collection("tasks");

  let cursor;

  if (id) {
    cursor = coll.find({ _id: new ObjectId(id) });
  } else if (name) {
    cursor = coll.find({
      name: { $regex: name, $options: "i" },
    });
  } else {
    cursor = coll.find();
  }

  const result = await cursor.toArray();
  return result;
}

module.exports = getTasksList;
