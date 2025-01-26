const logAction = require("./logAction.js");

function simpleLog(req, action, status, error) {
  if (error) {
    logAction(req.user.surname, action, {
      username: req.user.surname,
      role: req.user.role,
      status: status,
      reason: `${error}`,
    });
  } else {
    logAction(req.user.surname, action, {
      username: req.user.surname,
      role: req.user.role,
      status: status,
    });
  }
}

module.exports = simpleLog;
