const fs = require("fs");
const https = require("https");
const http = require("http");
const dotenv = require("dotenv");
const app = require("./app");
dotenv.config();

const HTTPS_PORT = process.env.PORT || 3000;
const HTTP_PORT = 8080;

const options = {
  key: fs.readFileSync(process.env.SSL_KEY_PATH),
  cert: fs.readFileSync(process.env.SSL_CERT_PATH),
};

https
  .createServer(options, app)
  .listen(HTTPS_PORT, () => {
    console.log(`Secure server running on https://localhost:${HTTPS_PORT}`);
  })
  .on("error", (err) => {
    console.error("HTTPS Server Error:", err);
  });

http
  .createServer((req, res) => {
    const host = req.headers.host.split(":")[0];
    res.writeHead(301, { Location: `https://${host}:${HTTPS_PORT}${req.url}` });
    res.end();
  })
  .listen(HTTP_PORT, () => {
    console.log("HTTP Server running on port 80 (redirecting to HTTPS)");
  })
  .on("error", (err) => {
    console.error("HTTP Server Error:", err);
  });
