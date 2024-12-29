// Ensure correct database is selected by specifying directly
const db = connect("127.0.0.1:27017/transportCompany");

print("Dropping existing collections...");
db.drivers.drop();
db.coordinators.drop();
db.trucks.drop();

print("Creating collections...");
db.createCollection("drivers");
db.createCollection("coordinators");
db.createCollection("trucks");

print("Inserting drivers...");
db.drivers.insertMany([
  {
    name: "John",
    surname: "Doe",
    birthDate: "1985-06-15",
    email: "john.doe@example.com",
    phone: "123456789",
    fullAddress: {
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      postalCode: "62704",
      country: "USA",
    },
    employmentDate: "2010-03-01",
    status: "active",
  },
  {
    name: "Jane",
    surname: "Smith",
    birthDate: "1990-08-25",
    email: "jane.smith@example.com",
    phone: "987654321",
    fullAddress: {
      address: "456 Elm St",
      city: "Chicago",
      state: "IL",
      postalCode: "60614",
      country: "USA",
    },
    employmentDate: "2015-07-15",
    status: "inactive",
  },
  {
    name: "Carlos",
    surname: "Martinez",
    birthDate: "1987-11-02",
    email: "carlos.martinez@example.com",
    phone: "234567890",
    fullAddress: {
      address: "101 Pine St",
      city: "Los Angeles",
      state: "CA",
      postalCode: "90001",
      country: "USA",
    },
    employmentDate: "2012-05-15",
    status: "active",
  },
  {
    name: "Emma",
    surname: "Wilson",
    birthDate: "1993-03-12",
    email: "emma.wilson@example.com",
    phone: "712345678",
    fullAddress: {
      address: "202 Birch Rd",
      city: "San Francisco",
      state: "CA",
      postalCode: "94103",
      country: "USA",
    },
    employmentDate: "2018-11-01",
    status: "active",
  },
]);

print("Inserting coordinators...");
db.coordinators.insertMany([
  {
    name: "Alice",
    surname: "Johnson",
    birthDate: "1982-04-10",
    email: "alice.johnson@example.com",
    phone: "122334455",
    fullAddress: {
      address: "789 Maple Ave",
      city: "Houston",
      state: "TX",
      postalCode: "77001",
      country: "USA",
    },
    employmentDate: "2008-06-20",
  },
  {
    name: "Bob",
    surname: "Brown",
    birthDate: "1975-12-05",
    email: "bob.brown@example.com",
    phone: "566778899",
    fullAddress: {
      address: "321 Oak St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    employmentDate: "2005-09-10",
  },
]);

print("Fetching driver IDs for truck assignment...");
const johnId = db.drivers.findOne({ name: "John" })._id;
const emmaId = db.drivers.findOne({ name: "Emma" })._id;

print("Inserting trucks...");
db.trucks.insertMany([
  {
    model: "Volvo FH",
    mileage: 120000,
    fuel: 150,
    maxFuel: 300,
    status: "operational",
    currentDriver: johnId,
  },
  {
    model: "Scania R450",
    mileage: 95000,
    fuel: 200,
    maxFuel: 400,
    status: "in maintenance",
    currentDriver: null,
  },
  {
    model: "Mercedes-Benz Actros",
    mileage: 80000,
    fuel: 250,
    maxFuel: 500,
    status: "operational",
    currentDriver: emmaId,
  },
  {
    model: "MAN TGX",
    mileage: 110000,
    fuel: 180,
    maxFuel: 400,
    status: "operational",
    currentDriver: null,
  },
]);

print("Database setup complete.");
