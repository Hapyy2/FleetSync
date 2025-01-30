const socketIO = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const chatHandlers = require("./chatHandlers");
const taskHandlers = require("./taskHandlers");

function configureSocketIO(server, client) {
  const io = socketIO(server, {
    cors: {
      origin: "http://localhost:3001",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // Store active connections with their user info
  const activeConnections = new Map();

  // Authenticate socket connections using JWT
  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");
      const token = cookies.accessToken;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
          if (err) return next(new Error("Invalid token"));

          const db = client.db("transportCompany");
          let user = null;
          let role = null;

          user = await db.collection("drivers").findOne({
            name: decoded.name,
            surname: decoded.surname,
          });

          if (user) {
            role = "driver";
          } else {
            user = await db.collection("coordinators").findOne({
              name: decoded.name,
              surname: decoded.surname,
            });
            if (user) {
              role = "coordinator";
            }
          }

          if (!user) {
            return next(new Error("User not found"));
          }

          socket.user = {
            id: user._id.toString(),
            name: user.name,
            surname: user.surname,
            role: role,
          };

          next();
        }
      );
    } catch (error) {
      return next(new Error("Authentication failed"));
    }
  });

  async function getAllUsers() {
    const db = client.db("transportCompany");

    const [drivers, coordinators] = await Promise.all([
      db.collection("drivers").find().toArray(),
      db.collection("coordinators").find().toArray(),
    ]);

    const allUsers = [
      ...drivers.map((d) => ({
        ...d,
        id: d._id.toString(),
        role: "driver",
      })),
      ...coordinators.map((c) => ({
        ...c,
        id: c._id.toString(),
        role: "coordinator",
      })),
    ];

    return allUsers.map((user) => ({
      id: user.id,
      name: user.name,
      surname: user.surname,
      role: user.role,
      status: activeConnections.has(user.id) ? "active" : "inactive",
    }));
  }

  io.on("connection", async (socket) => {
    console.log("New connection:", socket.id);

    if (socket.user) {
      activeConnections.set(socket.user.id, {
        socketId: socket.id,
        user: socket.user,
      });

      socket.emit("initialUserData", socket.user);

      const users = await getAllUsers();
      io.emit("activeUsers", users);

      chatHandlers(socket, io, activeConnections, client);
      taskHandlers(socket, io, activeConnections, client);

      socket.on("disconnect", async () => {
        if (socket.user?.id) {
          activeConnections.delete(socket.user.id);
          const users = await getAllUsers();
          io.emit("activeUsers", users);
        }
      });
    }
  });

  return io;
}

module.exports = configureSocketIO;
