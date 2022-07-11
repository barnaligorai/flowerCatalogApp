const appendComment = function () {
  // this function should accept comment to add.
  const allComments = document.querySelector('.comments');
  const comment = JSON.parse(this.response);
  const postElement = document.createElement('div');
  postElement.className = 'post';
  const timeStampElement = document.createElement('div');
  timeStampElement.className = 'timeStamp'
  timeStampElement.innerText = comment.timeStamp;
  const contentElement = document.createElement('div');
  contentElement.className = 'content';
  const nameDiv = document.createElement('div');
  nameDiv.className = 'name';
  nameDiv.innerText = comment.name;
  const commentDiv = document.createElement('div');
  commentDiv.className = 'comment';
  commentDiv.innerText = comment.comment;
  postElement.appendChild(timeStampElement);
  contentElement.appendChild(nameDiv);
  contentElement.appendChild(commentDiv);
  postElement.appendChild(contentElement);
  allComments.prepend(postElement);
};

const sendRequest = (method, url, body = '', callBack) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = callBack;
  xhr.open(method, url);
  xhr.send(body);
};

const addComment = (event) => {
  console.log('Inside add comment');
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const parsedForm = new URLSearchParams(formData);
  sendRequest('POST', '/add-comment', parsedForm, appendComment);
  // add comment to json + empty response + all data should be here.
  // Request for rest of data through API.
}

const main = () => {
  // ask for current comments here.
  const buttonElement = document.querySelector('#submit');
  console.log(buttonElement);
  buttonElement.onclick = addComment;
};

window.onload = main;
