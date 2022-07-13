const { createServer } = require('http');

const startServer = (PORT, handle) => {
  const server = createServer((req, res) => {
    console.log(new Date().toLocaleString(), req.method, req.url);
    handle(req, res);
  });

  server.listen(PORT, () => console.log(`Started listening on ${PORT}`));
};

module.exports = { startServer };
