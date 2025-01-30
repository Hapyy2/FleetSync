const getTasksList = require("./getTasksList.js");

async function deleteTask(client, id) {
  const db = client.db("transportCompany");
  const coll = db.collection("tasks");

  const findResult = await getTasksList(client, id);

  if (findResult.length == 1) {
    const result = await coll.deleteOne(findResult[0]);
    return { status: 200, message: "Task deleted", result: result };
  } else {
    return { status: 400, message: "Could not delete the task" };
  }
}

module.exports = deleteTask;
