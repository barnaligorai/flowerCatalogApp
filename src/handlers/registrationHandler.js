const registrationHandler = (req, res, next) => {
  if (req.url.pathname !== '/register') {
    next();
    return;
  }

  if (req.currentSession) {
    res.statusCode = 302;
    res.setHeader('location', '/guestbook.html');
    res.end();
    return;
  }

  if (req.matches('POST', '/register')) {
    const sessionId = req.sessions.add(req.bodyParams.username);
    res.statusCode = 302;
    res.setHeader('location', '/login');
    res.end();
    return;
  }

  req.url.pathname = '/register.html';
  next();
};

module.exports = { registrationHandler };
