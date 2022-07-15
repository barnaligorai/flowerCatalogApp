const serveLoginPage = (sessions, users) =>
  (req, res, next) => {

    if (req.currentSession) {
      res.redirect(302, '/guestbook');
      return;
    }

    req.url = '/login.html';
    next();
  };

module.exports = { serveLoginPage };
