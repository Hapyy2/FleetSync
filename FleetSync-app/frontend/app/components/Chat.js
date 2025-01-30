"use client";
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const ChatSidebar = ({ users, onSelectUser, selectedUser, currentUser }) => {
  const organizeUsers = () => {
    if (!users || !currentUser) return { coordinators: [], drivers: [] };

    return users.reduce(
      (acc, user) => {
        if (user.id === currentUser.id) return acc;

        if (user.role === "coordinator") {
          acc.coordinators.push(user);
        } else if (user.role === "driver") {
          acc.drivers.push(user);
        }
        return acc;
      },
      { coordinators: [], drivers: [] }
    );
  };

  const { coordinators, drivers } = organizeUsers();

  const UserItem = ({ user }) => (
    <div
      onClick={() => onSelectUser(user)}
      className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-100 
        ${selectedUser?.id === user.id ? "bg-gray-100" : ""}`}
    >
      <div className="relative">
        <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
          <span className="text-white font-medium">{user.name[0]}</span>
        </div>
        <div
          className={`absolute bottom-0 right-0 w-3 h-3 
            ${user.status === "active" ? "bg-green-500" : "bg-gray-400"} 
            rounded-full border-2 border-white`}
        />
      </div>
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-900">
          {user.name} {user.surname}
        </p>
        <p className="text-xs text-gray-500">{user.role}</p>
      </div>
    </div>
  );

  const UserSection = ({ title, userList }) =>
    userList.length > 0 && (
      <div className="mt-4">
        <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </h3>
        <div className="mt-2">
          {userList.map((user) => (
            <UserItem key={user.id} user={user} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="w-80 border-r border-gray-200 h-full overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
        {currentUser && (
          <div className="mt-2">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="text-sm font-medium text-teal-600">
              {currentUser.name} {currentUser.surname} ({currentUser.role})
            </p>
          </div>
        )}
      </div>

      {currentUser?.role === "coordinator" && (
        <>
          <UserSection title="Drivers" userList={drivers} />
          <UserSection title="Other Coordinators" userList={coordinators} />
        </>
      )}

      {currentUser?.role === "driver" && (
        <>
          <UserSection title="Coordinators" userList={coordinators} />
          <UserSection title="Other Drivers" userList={drivers} />
        </>
      )}
    </div>
  );
};

const ChatWindow = ({ selectedUser, messages, onSendMessage, currentUser }) => {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newMessage.trim() && selectedUser) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  if (!selectedUser || !currentUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">
          {!currentUser ? "Loading..." : "Select a user to start chatting"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {selectedUser.name[0]}
            </span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900">
              {selectedUser.name} {selectedUser.surname}
            </p>
            <p className="text-xs text-gray-500">{selectedUser.role}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={msg._id || idx}
            className={`flex ${
              msg.senderId === currentUser.id ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === currentUser.id
                  ? "bg-teal-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p>{msg.content}</p>
              <p className="text-xs mt-1 opacity-75">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 text-black"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 
              focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(true);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("https://localhost:3000", {
      withCredentials: true,
      transports: ["websocket"],
      rejectUnauthorized: false,
    });

    newSocket.on("connect", () => {
      setIsConnecting(false);
      setError(null);
      newSocket.emit("getInitialData");
    });

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
      setError("Failed to connect to chat server");
      setIsConnecting(false);
    });

    newSocket.on("initialUserData", (userData) => {
      if (userData) {
        setCurrentUser(userData);
      }
    });

    newSocket.on("activeUsers", (activeUsers) => {
      setUsers(activeUsers);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handlePrivateMessage = (message) => {
      if (!selectedUser) return;

      if (
        (message.senderId === selectedUser.id &&
          message.receiverId === currentUser.id) ||
        (message.senderId === currentUser.id &&
          message.receiverId === selectedUser.id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    };

    const handleMessageHistory = (history) => {
      setMessages(history);
    };

    socket.on("private_message", handlePrivateMessage);
    socket.on("message_history", handleMessageHistory);

    return () => {
      socket.off("private_message", handlePrivateMessage);
      socket.off("message_history", handleMessageHistory);
    };
  }, [socket, selectedUser, currentUser]);

  useEffect(() => {
    if (socket && selectedUser && currentUser) {
      socket.emit("get_message_history", { otherUserId: selectedUser.id });
      setMessages([]);
    }
  }, [selectedUser, socket, currentUser]);

  const handleSendMessage = (content) => {
    if (!socket || !selectedUser || !currentUser) return;

    socket.emit("private_message", {
      receiverId: selectedUser.id,
      content,
    });
  };

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (isConnecting) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Connecting to chat server...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white">
      <ChatSidebar
        users={users}
        currentUser={currentUser}
        selectedUser={selectedUser}
        onSelectUser={setSelectedUser}
      />
      <ChatWindow
        selectedUser={selectedUser}
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default Chat;
