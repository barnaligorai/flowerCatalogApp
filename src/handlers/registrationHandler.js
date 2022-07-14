const isUserValid = (users, username) =>
  users.some(user => user === username);

const redirectTo = (res, path) => {
  res.statusCode = 302;
  res.setHeader('location', path);
  res.end();
  return;
};

const registrationHandler = users =>
  (req, res, next) => {
    if (req.currentSession) {
      redirectTo(res, '/guestbook.html');
      return;
    }

    if (req.method === 'POST') {
      const username = req.body.username;

      if (!username) {
        res.statusCode = 400;
        res.end('Provide username');
        return;
      }

      if (isUserValid(users, username)) {
        res.statusCode = 200;
        res.end('Username already exists');
        return;
      }

      users.push(username);
      res.statusCode = 200;
      res.end('Registered successfully');
      return;
    }

    req.url = '/register.html';
    next();
  };

module.exports = { registrationHandler };
