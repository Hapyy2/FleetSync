async function saveMessage(client, messageData) {
  const db = client.db("transportCompany");
  const coll = db.collection("messages");

  const messageDoc = {
    senderId: messageData.senderId,
    receiverId: messageData.receiverId,
    content: messageData.content,
    timestamp: new Date(),
    chatId: [messageData.senderId, messageData.receiverId].sort().join("-"),
    read: false,
    deleted: {
      sender: false,
      receiver: false,
    },
  };

  try {
    const result = await coll.insertOne(messageDoc);
    return { status: 200, message: "Message saved", result: messageDoc };
  } catch (error) {
    console.error("Error saving message:", error);
    return { status: 500, message: "Error saving message", error };
  }
}

async function getMessageHistory(client, user1Id, user2Id) {
  const db = client.db("transportCompany");
  const coll = db.collection("messages");

  try {
    if (!user1Id || !user2Id) {
      console.error("Missing user IDs:", { user1Id, user2Id });
      return { status: 400, message: "Missing user IDs", messages: [] };
    }

    const chatId = [user1Id, user2Id].sort().join("-");

    const messages = await coll
      .find({
        chatId,
        "deleted.sender": false,
        "deleted.receiver": false,
      })
      .sort({ timestamp: 1 })
      .toArray();

    return { status: 200, messages };
  } catch (error) {
    console.error("Error fetching messages:", error);
    return {
      status: 500,
      message: "Error fetching messages",
      error,
      messages: [],
    };
  }
}

async function markMessageAsRead(client, messageId, userId) {
  const db = client.db("transportCompany");
  const coll = db.collection("messages");

  try {
    const result = await coll.updateOne(
      { _id: messageId, receiverId: userId },
      { $set: { read: true } }
    );
    return { status: 200, message: "Message marked as read", result };
  } catch (error) {
    console.error("Error marking message as read:", error);
    return { status: 500, message: "Error updating message", error };
  }
}

async function deleteMessage(client, messageId, userId) {
  const db = client.db("transportCompany");
  const coll = db.collection("messages");

  try {
    const message = await coll.findOne({ _id: messageId });
    if (!message) {
      return { status: 404, message: "Message not found" };
    }

    const updateField =
      message.senderId === userId ? "deleted.sender" : "deleted.receiver";

    const result = await coll.updateOne(
      { _id: messageId },
      { $set: { [updateField]: true } }
    );

    return { status: 200, message: "Message deleted", result };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { status: 500, message: "Error deleting message", error };
  }
}

module.exports = {
  saveMessage,
  getMessageHistory,
  markMessageAsRead,
  deleteMessage,
};
