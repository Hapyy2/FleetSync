// Ensure correct database is selected by specifying directly
const db = connect("127.0.0.1:27017/transportCompany");

print("Dropping existing collections...");
db.drivers.drop();
db.coordinators.drop();
db.trucks.drop();
db.tokens.drop();
db.tasks.drop();

print("Creating collections...");
db.createCollection("drivers");
db.createCollection("coordinators");
db.createCollection("trucks");
db.createCollection("tokens");
db.createCollection("tasks");

print("Inserting drivers...");
db.drivers.insertMany([
  {
    name: "John",
    surname: "Doe",
    birthDate: "1985-06-15",
    email: "john.doe@example.com",
    phone: "123456789",
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    password: "$2b$10$HTQHn38WEZIGtsaga07rqe6LTbarGWVJd8w/3xKv2CR4aTyqpZYP6",
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
    licensePlate: "8176ZMF",
    model: "Volvo FH",
    mileage: 120000,
    fuel: 150,
    maxFuel: 300,
    status: "operational",
    currentDriver: johnId,
  },
  {
    licensePlate: "7687FAY",
    model: "Scania R450",
    mileage: 95000,
    fuel: 200,
    maxFuel: 400,
    status: "in maintenance",
    currentDriver: null,
  },
  {
    licensePlate: "4468FNP",
    model: "Mercedes-Benz Actros",
    mileage: 80000,
    fuel: 250,
    maxFuel: 500,
    status: "operational",
    currentDriver: emmaId,
  },
  {
    licensePlate: "7740SGT",
    model: "MAN TGX",
    mileage: 110000,
    fuel: 180,
    maxFuel: 400,
    status: "operational",
    currentDriver: null,
  },
]);

print("Fetching truck licensePlates for task assignment...");
const johnTruck = db.trucks.findOne({ currentDriver: johnId }).licensePlate;
const emmaTruck = db.trucks.findOne({ currentDriver: emmaId }).licensePlate;

print("Inserting tasks...");
db.tasks.insertMany([
  {
    name: "Fruits to FruitCompany",
    status: "Waiting",
    driver: null,
    truck: null,
    deliveryDate: "2025-02-01",
    deliveryAddress: {
      address: "429 Book St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    description: "A delivery of bananas.",
  },
  {
    name: "Beans to BeanCompany",
    status: "In progress",
    driver: {
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      phone: "123456789",
    },
    truck: johnTruck,
    deliveryDate: "2025-02-04",
    deliveryAddress: {
      address: "233 Bean St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    description: "A delivery of beans.",
  },
  {
    name: "Butter to ButterCompany",
    status: "In progress",
    driver: {
      name: "Emma",
      surname: "Wilson",
      birthDate: "1993-03-12",
      email: "emma.wilson@example.com",
      phone: "712345678",
    },
    truck: emmaTruck,
    deliveryDate: "2025-02-01",
    deliveryAddress: {
      address: "123 Butter St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    description: "A delivery of butter.",
  },
  {
    name: "Computers to ComputerCompany",
    status: "Completed",
    driver: {
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      phone: "123456789",
    },
    truck: johnTruck,
    deliveryDate: "2025-02-01",
    deliveryAddress: {
      address: "398 Int St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    description: "A delivery of computers.",
  },
  {
    name: "Water to WaterCompany",
    status: "On hold",
    driver: {
      name: "John",
      surname: "Doe",
      email: "john.doe@example.com",
      phone: "123456789",
    },
    truck: johnTruck,
    deliveryDate: "2025-02-02",
    deliveryAddress: {
      address: "338 Saint St",
      city: "Dallas",
      state: "TX",
      postalCode: "75201",
      country: "USA",
    },
    description:
      "A delivery of water. On hold beacuse of missing initial payment.",
  },
]);

db.messages.createIndex({ chatId: 1, timestamp: 1 })
db.messages.createIndex({ senderId: 1 })
db.messages.createIndex({ receiverId: 1 })
db.messages.createIndex({ timestamp: 1 })

// Create indexes for users to speed up lookups
db.drivers.createIndex({ name: 1, surname: 1 })
db.coordinators.createIndex({ name: 1, surname: 1 })

print("Database setup complete.");
