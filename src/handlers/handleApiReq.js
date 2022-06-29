const handleApiReq = (guestBook) => {
  return (request, response) => {
    if (request.url.pathname === '/comments') {
      const jsonComments = JSON.stringify(guestBook.getComments());
      response.statuscode = 200;
      response.setHeader('Content-Type', 'application/json');
      response.end(jsonComments);
      return true;
    }
    return false;
  };
};

module.exports = { handleApiReq };
