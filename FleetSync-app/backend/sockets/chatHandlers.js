function chatHandlers(socket, io, activeConnections, dbClient) {
  // Handle private messages
  socket.on("private_message", async (data) => {
    try {
      const { receiverId, content } = data;
      const senderId = socket.user.id;

      if (!senderId || !receiverId || !content) {
        return;
      }

      // Create message document
      const messageDoc = {
        senderId,
        receiverId,
        content,
        timestamp: new Date(),
        chatId: [senderId, receiverId].sort().join("-"), // Consistent chat ID for both users
      };

      // Save message to database
      const db = dbClient.db("transportCompany");
      await db.collection("messages").insertOne(messageDoc);

      // Find receiver's socket if they're online
      const receiverConnection = activeConnections.get(receiverId);
      if (receiverConnection) {
        io.to(receiverConnection.socketId).emit("private_message", messageDoc);
      }

      // Send confirmation back to sender
      socket.emit("private_message", messageDoc);
    } catch (error) {
      console.error("Error handling private message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  // Handle message history requests
  socket.on("get_message_history", async (data) => {
    try {
      const { otherUserId } = data;
      const currentUserId = socket.user.id;

      if (!currentUserId || !otherUserId) {
        return;
      }

      // Create consistent chat ID regardless of sender/receiver order
      const chatId = [currentUserId, otherUserId].sort().join("-");

      const db = dbClient.db("transportCompany");
      const messages = await db
        .collection("messages")
        .find({ chatId })
        .sort({ timestamp: 1 })
        .toArray();

      socket.emit("message_history", messages);
    } catch (error) {
      console.error("Error fetching message history:", error);
      socket.emit("error", { message: "Failed to load message history" });
    }
  });
}

module.exports = chatHandlers;
