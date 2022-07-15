const displayMessage = (res) => {
  const messageBlock = document.querySelector('.message');
  messageBlock.innerText = res;
};

const sendPostReq = (event, cb) => {
  const xhr = new XMLHttpRequest();
  const formElement = document.querySelector('form');
  const formData = new FormData(formElement);
  const body = new URLSearchParams(formData);

  xhr.onload = () => {
    cb(xhr.response);
  };

  xhr.open('POST', '/register');
  xhr.send(body);
};

const main = () => {
  const form = document.querySelector('form');
  form.onkeydown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  };

  const button = document.querySelector('#register');
  button.onclick = (event) => sendPostReq(event, displayMessage);
};

window.onload = main;
