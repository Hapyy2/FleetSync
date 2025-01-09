function checkData(task) {
  const requiredKeys = ["name", "deliveryDate", "deliveryAddress"];
  const allRequiredKeysExist = requiredKeys.every((key) => key in task);

  if (allRequiredKeysExist) {
    if (!("status" in task)) {
      task.status = "Waiting";
    }
    if (!("driver" in task)) {
      task.driver = null;
    }
    if (!("truck" in task)) {
      task.driver = null;
    }
    if (!("description" in task)) {
      task.description = "Empty";
    }
    return 200;
  } else {
    return 400;
  }
}

async function createTask(client, doc) {
  const db = client.db("transportCompany");
  const coll = db.collection("tasks");

  const checkResult = checkData(doc);
  if (checkResult === 400) {
    return { status: 400, message: "Missing required data" };
  } else {
    const result = await coll.insertOne(doc);
    return { status: 200, message: "Task created", result: result };
  }
}

module.exports = createTask;
