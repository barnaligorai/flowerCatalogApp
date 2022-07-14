const logoutHandler = sessions =>
  (req, res, next) => {
    if (!req.matches('GET', '/logout')) {
      next();
      return;
    }

    if (req.currentSession) {
      const sessionId = req.currentSession.sessionId;
      sessions.delete(sessionId);
      res.setHeader('set-cookie', `sessionId= ${sessionId};max-age=-1`);
    }

    res.statusCode = 302;
    res.setHeader('location', '/login');
    res.end('Redirecting to login page');
  };

module.exports = { logoutHandler };
