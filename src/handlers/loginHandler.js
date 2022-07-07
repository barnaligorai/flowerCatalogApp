const loginHandler = sessions =>
  (req, res, next) => {
    if (req.url.pathname !== '/login') {
      next();
      return;
    }

    if (req.currentSession) {
      res.statusCode = 302;
      res.setHeader('location', '/guestbook.html');
      res.end();
      return;
    }

    // add cookie and session and redirect to homepage
    const username = req.bodyParams.username;
    if (username && req.method === 'POST') {
      const sessionId = sessions.add(username);
      res.setHeader('Set-Cookie', 'sessionId = ' + sessionId);
      res.statusCode = 302;
      res.setHeader('location', '/guestbook.html');
      res.end();
      return;
    }

    // redirect to login page
    req.url.pathname = '/login.html';
    next();
  };

module.exports = { loginHandler };
