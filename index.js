const fs = require('fs');
const { startServer } = require('./src/startServer.js');

const fileProcessor = {
  readFile: fs.readFileSync,
  writeFile: fs.writeFileSync,
  existsSync: fs.existsSync
};

startServer(4444, fileProcessor);
