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

const prependComment = function ({ response }) {
  // this function should accept comment to add.
  const comment = JSON.parse(response);
  const allComments = document.querySelector('.comments');
  const postElement = createPost(comment);
  allComments.prepend(postElement);
};

const sendRequest = (method, url, body = '', callBack) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => callBack(xhr);
  xhr.open(method, url);
  xhr.send(body);
};

const addComment = (event) => {
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const parsedForm = new URLSearchParams(formData);
  sendRequest('POST', '/add-comment', parsedForm, prependComment);
  formElement.reset();
  // add comment to json + empty response + all data should be here.
  // Request for rest of data through API.
};

const main = () => {
  // ask for current comments here.
  const buttonElement = document.querySelector('#submit');
  buttonElement.onclick = addComment;
};

window.onload = main;





