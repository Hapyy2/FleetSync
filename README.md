# FleetSync

instalki: <br>
```
npm install mongodb
npm install express
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
npm install cors
npm install cookie-parser
npm install socket.io
npm install mqtt
```

```
Podczas tworzenia projektu:
npm install --save-dev nodemon
```

aby sprawdzić czy poprawnie zainstalowano pakiety może posłużyć komenda: npm list --depth=0

```
odpalenie lokalnie mongodb
sudo systemctl start mongod
sudo systemctl status mongod
```

Aby aplikacja w pełni działała potrzebujemy brokera MQTT. Możemy zastosować broker HIVEMQ w wersji community:
https://github.com/hivemq/hivemq-community-edition
```
Po pobraniu w plikach brokera uruchamiamy skrypt: ./bin/run.sh
```


tworzenie klucza dla tokenu logowania (JWT)
```
in node run the following command:
require('crypto').randomBytes(64).toString('hex')
```

stworzenie własnych lokalnych certyfikatów
```
openssl genrsa -out localhost.key 2048
openssl req -new -key localhost.key -out localhost.csr
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt
```

Basic .env:
```
# Database
DB_CONNECTION=mongodb://localhost:27017/transportCompany

# JWT
ACCESS_TOKEN_SECRET=6e6d7c1950cf424aff5c8a063671e3b5b1de2685f907f8b854ae28b2501c9a624be638671801ab3fdadbbfbd5dcbae200e18c41827a2d3c06e38bbe60147e2ca
REFRESH_TOKEN_SECRET=3128470c55007ad89b7452a543d25b96fdc26c72153fc583fc125d781e7382bd3f7d9aea025aa3c87e82eb07f7eb71be79a911c4d0de3876d134e0f8fc75c0c2

# Server
PORT=3000

# TLS (for HTTPS)
SSL_KEY_PATH=backend/cert/localhost.key
SSL_CERT_PATH=backend/cert/localhost.crt

# Logging
LOG_PATH=backend/logs/logs.txt
```

## Sample Data: <br>

In order to provide sample data for our application you can run the exampleData.js using mongosh. It is configured for local server but it can be adjusted. The password for all of the sample accounts is *hellojs*. 
Command to run:
```
mongosh exampleData.js
```

## Frontend: <br>

```
nextjs 15 and react 18
npm install yup
npm install formik
npm install react-icons
npm install socket.io-client
npm install mqtt
```
