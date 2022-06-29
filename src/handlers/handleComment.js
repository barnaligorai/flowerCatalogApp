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

const addComment = ({ guestBook, url }) => {
  const { searchParams } = url;
  const { name, comment } = parseSearchParams(searchParams);
  const post = { name, comment, timeStamp: timeStamp() };
  guestBook.add(post);
};

const updateDatabase = (guestBook) => {
  const commentsJson = JSON.stringify(guestBook.getComments());
  const fileName = guestBook.sourceFile;
  fs.writeFileSync(fileName, commentsJson, 'utf8');
};

const handleComment = (request, response) => {
  addComment(request);
  updateDatabase(request.guestBook);

  // redirect to guestBook 
  response.statusCode = 302;
  response.setHeader('location', '/guestbook.html');
  response.end();
  return true;
};

module.exports = { handleComment };
