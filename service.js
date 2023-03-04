var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
  name:'teste',
  description: 'Sistema de controle de presença e relatório de estágio',
  script: 'C:\\app\\app.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});

svc.install();