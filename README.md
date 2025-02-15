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
