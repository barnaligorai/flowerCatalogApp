const serveRegistrationPage = (req, res, next) => {
  if (req.currentSession) {
    res.redirect(302, '/guestbook');
    return;
  }

  req.url = '/register.html';
  next();
};

module.exports = { serveRegistrationPage };
