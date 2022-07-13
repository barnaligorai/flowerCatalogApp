const request = require('supertest');
const { app } = require('../src/app.js');

const myApp = app();

describe('app', () => {

  describe('notFoundHandler', () => {

    it('should serve notFound page for GET /wrongUrl', (done) => {
      request(myApp)
        .get('/wrongUrl')
        .expect('content-type', /html/)
        .expect(/can't be reached/)
        .expect(404, done);
    });
  });

  describe('fileHandler', () => {

    it('should serve the home page for GET /', (done) => {
      request(myApp)
        .get('/')
        .expect('content-type', /html/)
        .expect(/flower-catalog/)
        .expect(200, done);
    });

    it('should serve login page for GET /login', (done) => {
      request(myApp)
        .get('/login')
        .expect('content-type', /html/)
        .expect(/title>Login</)
        .expect(200, done)
    });

    it('should serve registration page for GET /register', (done) => {
      request(myApp)
        .get('/register')
        .expect('content-type', /html/)
        .expect(/title>Register</)
        .expect(200, done)
    });

    it('should serve form.css page for GET /styles/form.css', (done) => {
      request(myApp)
        .get('/styles/form.css')
        .expect('content-type', /css/)
        .expect(/.form/)
        .expect(200, done)
    });
  });
});
