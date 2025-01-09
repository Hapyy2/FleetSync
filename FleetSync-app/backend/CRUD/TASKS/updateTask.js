const getTrucksList = require("./getTasksList.js");

function checkData(field) {
  const validKeys = [
    "name",
    "status",
    "driver",
    "truck",
    "deliveryDate",
    "deliveryAddress",
    "description",
  ];
  return validKeys.includes(field) ? 200 : 400;
}

async function updateTask(client, id, field, value) {
  const db = client.db("transportCompany");
  const coll = db.collection("tasks");

  const findResult = await getTasksList(client, id);
  const checkResult = checkData(field);
  if (checkResult === 400) {
    return { status: 400, message: "Invalid data" };
  }
  if (findResult.length == 1) {
    const updateQuery = { $set: { [field]: value } };
    const result = await coll.updateOne(findResult[0], updateQuery);
    return { status: 200, message: "Task updated", result: result };
  } else {
    return { status: 400, message: "Could not find the task" };
  }
}

module.exports = updateTask;
