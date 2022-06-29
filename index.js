const { startServer } = require('./src/server/startServer.js');
const { app } = require('./src/app.js');

startServer(4444, app());
