const request = require('supertest');
const { app } = require('../src/app.js');
const { Sessions } = require('../src/sessions.js');

const config = { sourceDir: './public', resourceDir: './resource' };
const sessions = new Sessions();
const users = ['bani'];

describe('app', () => {

  describe('GET /wrongUrl', () => {
    const myApp = app(config, sessions, users);
    it('should serve notFound page for GET /wrongUrl', (done) => {
      request(myApp)
        .get('/wrongUrl')
        .expect('content-type', /html/)
        .expect(/can't be reached/)
        .expect(404, done);
    });
  });

  describe('GET /fileName', () => {
    let myApp;
    beforeEach(() => {
      myApp = app(config, sessions, users);
    });
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
        .expect(200, done);
    });

    it('should serve registration page for GET /register', (done) => {
      request(myApp)
        .get('/register')
        .expect('content-type', /html/)
        .expect(/title>Register</)
        .expect(200, done);
    });

    it('should serve form.css page for GET /styles/form.css', (done) => {
      request(myApp)
        .get('/styles/form.css')
        .expect('content-type', /css/)
        .expect(/.form/)
        .expect(200, done);
    });
  });

  describe('GET /guestbook.html', () => {
    let myApp;
    beforeEach(() => {
      myApp = app(config, sessions, users);
    });
    it('should serve the login page for GET /guestbook.html when session is not present', (done) => {
      request(myApp)
        .get('/guestbook.html')
        .expect('location', '/login')
        .expect('need to login')
        .expect(302, done);
    });

    it('should serve the guestbook for GET /guestbook.html when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      myApp = app(config, sessions, users);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect('content-type', /html/)
        .expect(/form/)
        .expect(200, done);
    });

    it('should serve the guestbook for GET /guestbook.html when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      myApp = app(config, sessions, users);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', ['sessionId=1234'])
        .expect('location', '/login')
        .expect('need to login')
        .expect(302, done);
    });
  });
});
