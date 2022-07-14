const guestBookEntry = ({ timeStamp, name, comment }) => {
  return ["div.post",
    ["div.timestamp", timeStamp],
    ["div.content",
      ["div.name", name],
      ["div.comment", comment]]
  ];
};

const prependComments = ({ response, status }, lastId) => {
  if (status !== 200) {
    console.log('error');
    return;
  }
  const comments = JSON.parse(response).reverse();
  console.log('res', response);
  lastId.lastId = comments[comments.length - 1].id;

  const allComments = document.querySelector('.comments');

  comments.forEach(comment => {
    const postFormat = guestBookEntry(comment);
    const postElement = createElementTree(postFormat);
    allComments.prepend(postElement);
  });
};

const sendRequest = ({ method, url, body = '' }, callBack) => {
  const xhr = new XMLHttpRequest();
  xhr.onload = () => callBack(xhr);
  xhr.open(method, url);
  xhr.send(body);
};

const postComment = (callback) => {
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const commentDetails = new URLSearchParams(formData);

  const postRequest = { method: 'POST', url: '/add-comment', body: commentDetails };
  sendRequest(postRequest, ({ response, status }) => {
    if (status !== 200) {
      console.log('Error');
      return;
    }
    console.log('added comment', response);
    callback();
  });

  formElement.reset();
};

const fetchComments = (lastId) => {
  const commentsRequest = { method: 'GET', url: `/api/comments?after=${lastId.lastId}` };
  sendRequest(commentsRequest, (xhr) => prependComments(xhr, lastId));
};

const initPost = ({ response }) => {
  const lastId = JSON.parse(response);
  const buttonElement = document.querySelector('#submit');
  buttonElement.onclick = () => postComment(() => fetchComments(lastId));
};

const main = () => {
  const request = { method: 'GET', url: '/api/comments?q=last-id' };
  sendRequest(request, initPost);
};

window.onload = main;
