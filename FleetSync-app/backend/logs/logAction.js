const fs = require("fs");
const path = require("path");

function logAction(userId, action, details) {
  const logPath = path.join(__dirname, process.env.LOG_PATH);
  const logEntry = `[${new Date().toISOString()}] User: ${userId} | Action: ${action} | Details: ${JSON.stringify(
    details
  )}\n`;

  fs.appendFile(logPath, logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}

module.exports = logAction;
