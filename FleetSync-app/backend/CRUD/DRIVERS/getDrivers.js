export async function getDrivers(client) {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("transportCompany");
    const coll = db.collection("drivers");
    // find code goes here
    const cursor = coll.find();
    // iterate code goes here
    const result = await cursor.toArray();
    return result;
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
