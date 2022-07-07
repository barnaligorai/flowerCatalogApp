const parseCookiesString = (cookiesString) => {
  const cookies = {};

  if (!cookiesString) {
    return cookies;
  }

  cookiesString.split(';').forEach(cookie => {
    const [name, value] = cookie.split('=');
    cookies[name.trim()] = value.trim();
  });
  return cookies;
};

const parseCookies = (req, res, next) => {
  const cookies = parseCookiesString(req.headers.cookie);
  req.cookies = cookies;
  next();
};

module.exports = { parseCookies };
