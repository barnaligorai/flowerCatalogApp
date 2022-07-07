const parseCookies = (cookiesString) => {
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

const injectCookies = (req, res, next) => {
  const cookies = parseCookies(req.headers.cookie);
  req.cookies = cookies;
  next();
};

module.exports = { injectCookies };
