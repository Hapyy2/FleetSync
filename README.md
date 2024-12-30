# FleetSync

instalki: <br>
```
npm install mongodb
npm install express
npm install dotenv
```

aby sprawdzić czy poprawnie zainstalowano pakiety może posłużyć komenda: npm list --depth=0

```
odpalenie lokalnie mongodb
sudo systemctl start mongod
sudo systemctl status mongod
```

## Sample Data: <br>

In order to provide sample data for our application you can run the exampleData.js using mongosh. It is configured for local server but it can be adjusted. 
Command to run:
mongosh exampleData.js
