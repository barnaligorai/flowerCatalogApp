const fs = require('fs');

const timeStamp = () => {
  const dateString = new Date().toLocaleString();
  const [date, time] = dateString.split(',');
  return date + time;
};

const parseSearchParams = (searchParams) => {
  const queryParams = {};
  [...searchParams.entries()].forEach(([key, value]) =>
    queryParams[key] = value);
  return queryParams;
};

const addComment = ({ guestbook, url }) => {
  const { searchParams } = url;
  const { name, comment } = parseSearchParams(searchParams);
  const post = { name, comment, timeStamp: timeStamp() };
  guestbook.add(post);
};

const updateDatabase = (guestbook) => {
  const commentsJson = JSON.stringify(guestbook.getComments());
  const fileName = guestbook.sourceFile;
  fs.writeFileSync(fileName, commentsJson, 'utf8');
};

const handleComment = (request, response) => {
  addComment(request);
  updateDatabase(request.guestbook);

  // redirect to guestbook 
  response.statusCode = 302;
  response.setHeader('location', '/guestbook.html');
  response.end();
  return true;
};

module.exports = { handleComment };
