const isUserValid = (users, username) =>
  users.some(user => user === username);

const newRegistration = (users) =>
  (req, res) => {
    const username = req.body.username;

    if (!username) {
      res.statusCode = 400;
      res.end('Provide username');
      return;
    }

    if (isUserValid(users, username)) {
      res.statusCode = 400;
      res.end('Username already exists');
      return;
    }

    users.push(username);
    res.end('Registered successfully');
  };

module.exports = { newRegistration };
