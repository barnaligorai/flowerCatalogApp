const { startServer } = require('./src/server/startServer.js');
const { app } = require('./src/app.js');
const { Sessions } = require('./src/sessions.js');

const config = { sourceDir: './public', resourceDir: './resource' };
const sessions = new Sessions();
const users = ['bani'];

startServer(4444, app(config, sessions, users));
