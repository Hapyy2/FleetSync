<div align="center">
  <img src="/doc/images/FleetSync_logo.png" alt="Main logo" style="width:25%; height:auto;">
  <h1>FleetSync</h1>
  <h3>A web application for quick and easy management of your transport company.</h3>
  <strong><a href="#feat">✨ Features</a> | <a href="#tech">🛠️ Technologies</a> | <a href="#start">🚀 Getting Started</a> | <a href="#screens">📸 Screenshots</a></strong>
</div>

<h2 id="intro">🚛 Introduction</h2>

<h2 id="feat">✨ Features</h2>

<h2 id="tech">🛠️ Technologies Used</h2>

### Backend 🔌
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-Latest-000000?style=flat&logo=express)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?style=flat&logo=node.js)](https://nodejs.org/)
[![JWT](https://img.shields.io/badge/JWT-Latest-000000?style=flat&logo=json-web-tokens)](https://jwt.io/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Latest-010101?style=flat&logo=socket.io)](https://socket.io/)
[![MQTT](https://img.shields.io/badge/MQTT-Latest-660066?style=flat&logo=mqtt)](https://mqtt.org/)
[![HIVEMQ](https://img.shields.io/badge/HIVEMQ-Community-FF9900?style=flat&logo=hivemq)](https://www.hivemq.com/)
[![Nodemon](https://img.shields.io/badge/Nodemon-Latest-76D04B?style=flat&logo=nodemon)](https://nodemon.io/)

### Frontend 💻
[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?style=flat&logo=react)](https://reactjs.org/)
[![Yup](https://img.shields.io/badge/Yup-Latest-purple?style=flat)](https://github.com/jquense/yup)
[![Formik](https://img.shields.io/badge/Formik-Latest-2196F3?style=flat&logo=formik)](https://formik.org/)
[![React Icons](https://img.shields.io/badge/React%20Icons-Latest-E91E63?style=flat&logo=react)](https://react-icons.github.io/react-icons/)
[![Socket.IO Client](https://img.shields.io/badge/Socket.IO%20Client-Latest-010101?style=flat&logo=socket.io)](https://socket.io/docs/v4/client-api/)
[![MQTT.js](https://img.shields.io/badge/MQTT.js-Latest-660066?style=flat&logo=mqtt)](https://github.com/mqttjs/MQTT.js)

<h2 id="start">🚀 Getting Started</h2>

Clone the repository
```bash
git clone https://github.com/Hapyy2/FleetSync.git
cd FleetSync
```

### Backend 🔌  
Run ```npm install``` in the **FleetSync-app** directory but if it does not install all of the dependencies properly run the following:  
```bash
npm install mongodb
npm install express
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install cors
npm install cookie-parser
npm install socket.io
npm install mqtt
npm install --save-dev nodemon
```

> [!TIP]
> In order to check if the dependencies where installed properly run the following command: *npm list --depth=0*

In order for the app to work properly we need to setup a MQTT broker. As an example you can use <a href="https://github.com/hivemq/hivemq-community-edition">HIVEMQ broker community</a>.  
After downloading the broker run it in its directory by: *./bin/run.sh*.  
Additionaly we need a mongodb. We can choose to setup the server locally or use a service like <a href="https://www.mongodb.com/products/platform/atlas-database">Atlas</a>. If you choose to setup the mongodb locally run the following commands:  
```bash
sudo systemctl start mongod
sudo systemctl status mongod
```

To generate keys for JWT tokens you can run the following command twice in node enviroment:
```bash
require('crypto').randomBytes(64).toString('hex')
```

In order to generate local certification for TLS you can use openssl in terminal:  
```bash
openssl genrsa -out localhost.key 2048
openssl req -new -key localhost.key -out localhost.csr
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt
```

Example of an .env file:
```bash
# Database
DB_CONNECTION=[Your database url (For local mongodb: "mongodb://localhost:27017/transportCompany")]

# JWT
ACCESS_TOKEN_SECRET=[Your JWT key #1]
REFRESH_TOKEN_SECRET=[Your JWT key #2]

# Server
PORT=3000

# TLS (for HTTPS)
SSL_KEY_PATH=backend/cert/localhost.key
SSL_CERT_PATH=backend/cert/localhost.crt

# Logging
LOG_PATH=backend/logs/logs.txt
```

In the backend directory run to start the server:  
```
npm run devStart
```

### Sample Data: <br>

In order to provide sample data for our application you can run the exampleData.js using mongosh. It is configured for local server but it can be adjusted. Command to run:  
```bash
mongosh exampleData.js
```
> [!IMPORTANT]
> The password for all of the sample accounts is *hellojs*.   

### Frontend 💻  
You need to install **nextjs 15** and **React 18**. After making sure its properly installed run ```npm install``` in the **frontend** directory but if it does not install all of the dependencies properly run the following:  
```
npm install yup
npm install formik
npm install react-icons
npm install socket.io-client
npm install mqtt
```
In the frontend directory run to start the app:  
```
npm start dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to use the app.

<h2 id="structure">🗂️ Project Structure</h2>

### Backend 🔌
```
.
├── CRUD
│   ├── CHAT
│   │   └── chatMessage.js
│   ├── COORDINATORS
│   │   ├── getCoordinatorsList.js
│   │   └── routesCoordinators.js
│   ├── DRIVERS
│   │   ├── CRUD.js
│   │   ├── createDriver.js
│   │   ├── deleteDriver.js
│   │   ├── getDriversList.js
│   │   └── updateDriver.js
│   ├── TASKS
│   │   ├── CRUD.js
│   │   ├── createTask.js
│   │   ├── deleteTask.js
│   │   ├── getTasksList.js
│   │   └── updateTask.js
│   └── TRUCKS
│       ├── CRUD.js
│       ├── createTruck.js
│       ├── deleteTruck.js
│       ├── getTrucksList.js
│       └── updateTruck.js
├── app.js
├── cert
│   ├── localhost.crt
│   ├── localhost.csr
│   └── localhost.key
├── logs
│   ├── logAction.js
│   ├── logs.txt
│   └── simpleLog.js
├── mqttClient.js
├── server.js
├── sockets
│   ├── chatHandlers.js
│   ├── faultHandlers.js
│   ├── socketConfig.js
│   └── taskHandlers.js
└── userAuth
    ├── authenticateToken.js
    ├── login.js
    ├── logout.js
    ├── refreshToken.js
    └── tokenExpiration.js
```
### Frontend 💻
```
.
├── components
│   ├── Chat.js
│   ├── CoordinatorDashboard.js
│   ├── CoordinatorSidebar.js
│   ├── DriverForm.js
│   ├── DriverSidebar.js
│   ├── FaultManagement.js
│   ├── FaultReportForm.js
│   ├── LoginForm.js
│   ├── Modal.js
│   ├── TaskForm.js
│   ├── TaskList.js
│   └── TruckForm.js
├── coordinator_panel
│   ├── addDriver
│   │   ├── layout.js
│   │   └── page.js
│   ├── addTask
│   │   ├── layout.js
│   │   └── page.js
│   ├── addTruck
│   │   ├── layout.js
│   │   └── page.js
│   ├── chat
│   │   ├── layout.js
│   │   └── page.js
│   ├── layout.js
│   ├── page.js
│   ├── report
│   │   ├── layout.js
│   │   └── page.js
│   └── tasks
│       ├── layout.js
│       └── page.js
├── driver_panel
│   ├── chat
│   │   ├── layout.js
│   │   └── page.js
│   ├── layout.js
│   ├── page.js
│   └── report
│       ├── layout.js
│       └── page.js
├── favicon.ico
├── globals.css
├── hooks
│   └── useMqtt.js
├── layout.js
└── page.js
```
> [!NOTE]
> The contents of the Frontend code are located inside a React app.

<h2 id="detail">🔍 Features in Detail</h2>

<h2 id="screens">📸 Screenshots</h2>
