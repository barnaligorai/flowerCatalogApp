const injectSession = sessions =>
  (req, res, next) => {

    const sessionId = req.cookies.sessionId;
    if (sessionId) {
      req.currentSession = sessions.get(sessionId);
    }

    next();
  };

module.exports = { injectSession };
