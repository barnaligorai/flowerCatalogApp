const matches = function (method, path) {
  return this.method === method && this.url.pathname === path;
};

const parseUrlSearchParams = (req, res, next) => {
  req.url = new URL(`http://${req.headers.host}${req.url}`);
  req.matches = matches.bind(req);
  next();
};

module.exports = { parseUrlSearchParams };
