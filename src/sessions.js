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
}

exports.Sessions = Sessions;
