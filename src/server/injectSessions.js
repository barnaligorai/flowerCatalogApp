const injectSessions = sessions =>
  (req, res, next) => {
    req.currentSession = sessions.get(req.cookies.sessionId);
    next();
  };

module.exports = { injectSessions };
