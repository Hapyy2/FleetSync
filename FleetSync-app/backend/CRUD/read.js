const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);
async function run() {
  try {
    await client.connect();
    // database and collection code goes here
    const db = client.db("transportCompany");
    const coll = db.collection("drivers");
    // find code goes here
    const cursor = coll.find();
    // iterate code goes here
    await cursor.forEach(console.log);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
