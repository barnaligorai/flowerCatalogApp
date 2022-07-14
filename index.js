const { createApp } = require('./src/app.js');

const startServer = (PORT) => {
  const { Sessions } = require('./src/sessions.js');
  const config = { sourceDir: './public', templateFile: './resource/guestbookTemplate.html', dataFile: './data/guestBook.json' };

  const sessions = new Sessions();
  const users = ['bani'];

  const app = createApp(config, sessions, users, console.log);
  app.listen(PORT, () => {
    console.log(`Started listening on ${PORT}`);
  });
};

startServer(4444);
