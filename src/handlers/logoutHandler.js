const logoutHandler = sessions =>
  (req, res, next) => {

    if (req.currentSession) {
      const sessionId = req.currentSession.sessionId;
      sessions.delete(sessionId);
      res.setHeader('set-cookie', `sessionId= ${sessionId};max-age=-1`);
    }

    res.redirect('/login');
  };

module.exports = { logoutHandler };
