# appController

### Nodejs web application that can be used to control a suite of nodejs web applications

It includes an apps admin page and a users admin page.

The apps admin page enables the system administator to start, stop or restart the apps installed in the suite.

The users admin page is used to create, edit and delete users.

The authentication component (PSQL-based) is shared between the Controller and all the other apps.

The http traffic is handled by express
## Requirements

- node>=10.16.0
- postgresql>=12.7


## Installation
- Run sql/users.sql to create users table in your PostgreSQL database
- Create at least one user with admin role
- Edit config/default.json to provide the database connection parameters, the admin user credentials and the app list:
```
{
	"database":{	// database connection parameters
	  "user": "...",
	  "host": "...",
	  "database": "...",
	  "password": "...",
	  "port": ...
	},
	"user": {
	  "username": "...",
	  "password": "...",
	  "token": "..."
	},
	"app_list":{	// applications list
		"app_name": {	// application name
			"dir": "...",		// the relative path of the app
			"script": "...",	// the filename of the app executable 
			"testpath": "...",	// the url path to test if the app is running 
			"logfile": "...", 	// the app log file location 
			"port": "..."		// the port where the app runs
		},
		...
	}
}
```
## Requirements for the controlled apps
- The controlled apps must be placed in the same base directory of the controller app.
- They must expose a /exit GET endpoint which terminates the app (given the right credentials)
- To deal with authentication, each app must contain the following: 
```
const express = require('express')
const app = express()
const { Pool } = require('pg')
const config = require('config');
const pool = new Pool(config.database)
const auth = require('../../appController/app/authentication.js')(app,config,pool)
const passport = auth.passport
```
Then auth can be used as middleware in app calls:
```
app.get('/endpoint',auth.isAdmin,(req,res)=>{
	...
})
```
## Uso
### Interfaz gráfica
https://alerta.ina.gob.ar/controller (requiere usuario administrador)
### Interfaz de bash
````bash
cd 44-NODEJS_APIS/appController
node appController.js --help
````
````text
Usage: appController [options] [command]

Options:
-V, --version           output the version number
-h, --help              output usage information

Commands:
start [options]
stop [options]
check [options]
restart [options]
hard_restart [options]
````
Ejemplo: checkear status de aplicaciones
````bash
node appController.js check
````
````text
La aplicación sat2 está funcionando en el puerto 3002. statusCode: 200
La aplicación wmlclient_wc está funcionando en el puerto 3003. statusCode: 200
La aplicación alerta5DBIO está funcionando en el puerto 3005. statusCode: 302
La aplicación alerta5DBIO_test está funcionando en el puerto 4005. statusCode: 302
La aplicación heatmap está funcionando en el puerto 4001. statusCode: 200
La aplicación appController está funcionando en el puerto 3006. statusCode: 200
La aplicación directory_listings está funcionando en el puerto 4002. statusCode: 200
La aplicación informe_complementario está funcionando en el puerto 3000. statusCode: 200
La aplicación alerta5DBIO_pub está funcionando en el puerto 4006. statusCode: 200
````
Ejemplo: reiniciar aplicación
````bash
node appController.js restart -a alerta5DBIO
````
````text
La aplicación alerta5DBIO se detuvo exitosamente
Se inició la app alerta5DBIO con el PID 17455
````
Si no funciona, intentar hard_restart.
````bash
node appController.js hard_restart -a alerta5DBIO
````
Si hard_restart no funciona. Buscar el pid del procedimiento usando el puerto y detenerlo con kill. 
````bash
sudo ss -lptn 'sport = :3005'
````
````text
State                  Recv-Q                  Send-Q                                    Local Address:Port                                    Peer Address:Port                  
LISTEN                 0                       128                                                   *:3005                                               *:*                      users:(("node",pid=17455,fd=18))
````
````text
sudo kill 17455
````
Luego iniciar con start
````bash
node appController.js start -a alerta5DBIO
````
La configuración de las aplicaciones está en config/default.json

