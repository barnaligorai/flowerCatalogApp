class Sessions {
  #sessions;

  constructor() {
    this.#sessions = {};
  }

  add(username) {
    const time = new Date();
    const sessionId = time.getTime();
    const session = { time, sessionId, username };
    this.#sessions[sessionId] = session;
    return sessionId;
  }

  delete(sessionId) {
    delete this.#sessions[sessionId];
  }

  get(sessionId) {
    return this.#sessions[sessionId];
  }
};

const sessions = new Sessions();

const injectSessions = (req, res, next) => {
  req.sessions = sessions;
  req.currentSession = sessions.get(req.cookies.sessionId);
  next();
};

module.exports = { injectSessions };
