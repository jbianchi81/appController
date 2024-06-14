const program = require('commander')
program.version('0.0.1');
const fs = require('fs')
//~ const axiosCookieJarSupport = require('axios-cookiejar-support').default;
//~ const tough = require('tough-cookie');
//~ axiosCookieJarSupport(axios);
//~ const cookieJar = new tough.CookieJar();

//~ var server_url = "localhost"
// const app_list = JSON.parse(fs.readFileSync('app_list.json','utf8'))
//~ const proxy = "http://jbianchi:jbianchi@10.10.10.119:3128"
//~ var agent = new HttpsProxyAgent(proxy);

const config = require('config')
const app_list = config.app_list

const Controller = require('./app/controllerPromise.js') // require('./app/controller.js')
const controller = new Controller.controller(app_list,config)

program
  .command('start')
  .option('-a, --app <value>','app name')
  .option('-t, --timeout <value>','app check timeout [ms]')
  .action(options=>{
	//~ console.log(app_list)
	console.log("appController start @ " + new Date().toISOString())
	var timeout = (options.timeout) ? parseInt(options.timeout) : config.timeout
	if(options.app) {
		controller.startAppSt(options.app,timeout)
	} else {
		Object.keys(app_list).forEach( key=>{ // .filter(key=>!app_list[key].controller) FILTER REMOVED!
			controller.startAppSt(key)
		})
	}
  })

program
  .command('stop')
  .option('-a, --app <value>','app name')
  .action(options=>{
	console.log("appController stop @ " + new Date().toISOString())
	if(options.app) {
		controller.checkAppStatus(options.app)
		.then(response=>{
			if(response.statusCode == 200) { // active
				controller.stopApp2(options.app)
			} else if (response.statusCode == 504) { // not responding
				controller.stopApp(options.app)
			} else { // inactive
				console.log("La app " + options.app + " no está corriendo")
			}
		})
	} else {
		Object.keys(app_list).filter(key=>!app_list[key].controller).forEach( key=>{
			controller.checkAppStatus(key)
			.then(response=>{
				if(response.statusCode == 200) { // active
					controller.stopApp2(key)
				} else if (response.statusCode == 504) { // not responding
					console.log("La app " + key + " no responde (timeout). Deteniendo proceso")
					controller.stopApp(key)
				} else {
					console.log("La app " + key + " no está corriendo")
				}
			})
		})
	}
  })
  
program
  .command('check')
  .option('-a, --app <value>','app name')
  .action(options=>{
	console.log("appController check @ " + new Date().toISOString())
	if(options.app) {
		var app = options.app
		if(!app_list[app]) {
			console.error("Error: no existe la app indicada")
			return
		}
		controller.checkAppStatus(options.app)
		.then(response=>{
			if(response.statusCode < 400) {
				console.log("La aplicación " + app + " está funcionando en el puerto " + app_list[app].port)
			} else if(response.statusCode == 504) {
				console.log("La aplicación " + app + " en el puerto " + app_list[app].port + " no responde (timeout)")
			} else {
				console.log("La aplicación " + app + " NO está funcionando")
			}
		})
		.catch(e=>{
			console.error(e)
		})
	} else {
		Object.keys(app_list).forEach( app=>{
			controller.checkAppStatus(app)
			.then(response=>{
				if(response.statusCode == 200) {
					console.log("La aplicación " + app + " está funcionando en el puerto " + app_list[app].port)
				} else if(response.statusCode == 504) {
					console.log("La aplicación " + app + " en el puerto " + app_list[app].port + " no responde (timeout)")
				} else {
					console.log("La aplicación " + app + " NO está funcionando")
				}
			})
			.catch(e=>{
				console.error(e)
			})
		})
	}
  })
  
program
  .command('restart')
  .option('-a, --app <value>','app name')
  .action(options=>{
	console.log("appController restart @ " + new Date().toISOString())
	if(options.app) {
		var app = options.app
		if(!app_list[app]) {
			console.error("Error: no existe la app indicada")
			return
		}
		controller.stopApp2(app)
		.then(()=>{
			setTimeout(()=>{
				controller.startApp(app)
			},1000)
		})
		.catch(e=>{
			console.error(e.toString())
		})
	} else {
		Object.keys(app_list).filter(key=>!app_list[key].controller).forEach( key=>{
			controller.stopApp2(key)
			.then(()=>{
				setTimeout(()=>{
					controller.startApp(key)
				},1000)
			})
		})
	}
  })

  program
  .command('hard_restart')
  .option('-a, --app <value>','app name')
  .action(options=>{
	console.log("appController hard_restart @ " + new Date().toISOString())
	if(options.app) {
		var app = options.app
		if(!app_list[app]) {
			console.error("Error: no existe la app indicada")
			return
		}
		controller.stopApp(app)
		.then(()=>{
			setTimeout(()=>{
				controller.startApp(app)
			},1000)
		})
	} else {
		Object.keys(app_list).filter(key=>!app_list[key].controller).forEach( key=>{
			controller.stopApp(key)
			.then(()=>{
				setTimeout(()=>{
					controller.startApp(key)
				},1000)
			})
		})
	}
  })


program.parse(process.argv);
