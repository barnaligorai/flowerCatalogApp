const createName = ({ name }) => {
  const nameDiv = document.createElement('div');
  nameDiv.className = 'name';
  nameDiv.innerText = name;
  return nameDiv;
};

const createComment = ({ comment }) => {
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerText = comment;
  return commentDiv;
};

const createContent = (comment) => {
  const contentElement = document.createElement('div');
  contentElement.className = 'content';

  const nameDiv = createName(comment);
  const commentDiv = createComment(comment);

  contentElement.appendChild(nameDiv);
  contentElement.appendChild(commentDiv);

  return contentElement;
};

const createTimeStamp = ({ timeStamp }) => {
  const timeStampElement = document.createElement('div');
  timeStampElement.className = 'timeStamp';
  timeStampElement.innerText = timeStamp;
  return timeStampElement;
};

const createPost = (comment) => {
  const postElement = document.createElement('div');
  postElement.className = 'post';
  const timeStampElement = createTimeStamp(comment);
  const contentElement = createContent(comment);

  postElement.appendChild(timeStampElement);
  postElement.appendChild(contentElement);
  return postElement;
};

const prependComment = function (comment) {
  const allComments = document.querySelector('.comments');
  const postElement = createPost(comment);
  allComments.prepend(postElement);
};

const prependComments = ({ response, status }, lastId) => {
  if (status !== 200) {
    console.log('error');
    return;
  }
  const comments = JSON.parse(response).reverse();
  lastId.lastId = comments[comments.length - 1].id;
  comments.forEach(comment => prependComment(comment));
};

const sendRequest = (method, url, callBack, body = '') => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => callBack(xhr);
  xhr.open(method, url);
  xhr.send(body);
};

const addComment = (lastId) => {
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const parsedForm = new URLSearchParams(formData);
  sendRequest('POST', '/add-comment', () => { console.log('added comment'); }, parsedForm);
  formElement.reset();

  sendRequest('GET', `/api/comments?after=${lastId.lastId}`, (xhr) => prependComments(xhr, lastId));
};

const main = () => {
  sendRequest('GET', '/api/comments?q=last-id', ({ response }) => {
    const lastId = JSON.parse(response);
    const buttonElement = document.querySelector('#submit');
    buttonElement.onclick = () => addComment(lastId);
  });
};

window.onload = main;
