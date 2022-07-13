const isUserValid = (users, username) =>
  users.some(user => user === username);

const redirectTo = (res, path) => {
  res.statusCode = 302;
  res.setHeader('location', path);
  res.end();
  return;
};

const loginHandler = (sessions, users) =>
  (req, res, next) => {
    if (req.url.pathname !== '/login') {
      next();
      return;
    }

    if (req.currentSession) {
      redirectTo(res, '/guestbook.html')
      return;
    }

    // add cookie and session and redirect to guestbook
    const username = req.body.username;
    if (username && req.method === 'POST') {
      if (!isUserValid(users, username)) {
        redirectTo(res, '/register');
        return;
      }

      const sessionId = sessions.add(username);
      res.setHeader('Set-Cookie', `sessionId = ${sessionId}`);
      redirectTo(res, '/guestbook.html');
      return;
    }

    // redirect to login page
    req.url.pathname = '/login.html';
    next();
  };

module.exports = { loginHandler };
