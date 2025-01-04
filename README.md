# FleetSync

instalki: <br>
```
npm install mongodb
npm install express
npm install dotenv
npm install bcrypt
npm install jsonwebtoken
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

tworzenie klucza dla tokenu logowania (JWT)
```
in node run the following command:
require('crypto').randomBytes(64).toString('hex')
```

## Sample Data: <br>

In order to provide sample data for our application you can run the exampleData.js using mongosh. It is configured for local server but it can be adjusted. The password for all of the sample accounts is *hellojs*. 
Command to run:
```
mongosh exampleData.js
```
