const isUserValid = (users, username) =>
  users.some(user => user === username);

const newLogin = (sessions, users) =>
  (req, res, next) => {
    const username = req.body.username;
    if (username && req.method === 'POST') {
      if (!isUserValid(users, username)) {
        res.redirect(302, '/register');
        return;
      }
      const sessionId = sessions.add(username);
      res.setHeader('Set-Cookie', `sessionId = ${sessionId}`);
      res.redirect(302, '/guestbook');
      return;
    }

    req.url = '/login.html';
    next();
  };

module.exports = { newLogin };
