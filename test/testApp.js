const request = require('supertest');
const { app } = require('../src/app.js');
const { Sessions } = require('../src/sessions.js');

describe('app', () => {
  let config;
  let sessions;
  let users;
  let myApp;

  beforeEach(() => {
    config = { sourceDir: './public', resourceDir: './resource' };
    sessions = new Sessions();
    users = [];
    myApp = app(config, sessions, users);
  });

  describe('GET /wrongUrl', () => {
    it('should serve notFound page for GET /wrongUrl', (done) => {
      request(myApp)
        .get('/wrongUrl')
        .expect('content-type', /html/)
        .expect(/can't be reached/)
        .expect(404, done);
    });
  });

  describe('GET /fileName', () => {
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
    it('should serve the login page for GET /guestbook.html when session is not present', (done) => {
      request(myApp)
        .get('/guestbook.html')
        .expect('location', '/login')
        .expect('need to login')
        .expect(302, done);
    });

    it('should serve the guestbook for GET /guestbook.html when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect('content-type', /html/)
        .expect(/form/)
        .expect(200, done);
    });

    it('should serve the guestbook for GET /guestbook.html when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', ['sessionId=1234'])
        .expect('location', '/login')
        .expect('need to login')
        .expect(302, done);
    });
  });

  describe('POST /login', () => {
    it('should redirect the user to register page for POST /login when user is not registered', (done) => {
      request(myApp)
        .post('/login')
        .send('username=bani')
        .expect('location', '/register')
        .expect(/redirect/)
        .expect(302, done);
    });

    it('should log the user in for POST /login when user is valid', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users);
      request(myApp)
        .post('/login')
        .send('username=bani')
        .expect('location', '/guestbook.html')
        .expect(/redirect/)
        .expect(302, done);
    });

    it('should log the user in for POST /login when user is valid', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users);
      request(myApp)
        .post('/login')
        .send('username=barnali')
        .expect('location', '/register')
        .expect(/redirect/)
        .expect(302, done);
    });
  });

  describe('POST /add-comment', () => {
    it('should add a comment in guestbook for POST /add-comment when session is valid', (done) => {
      const config = {
        sourceDir: './public',
        templateFile: './resource/guestbookTemplate.html',
        dataFile: './test/testData/dummyGuestBook.json'
      };
      const sessionId = sessions.add('bani');
      users.push('bani');
      const myApp = app(config, sessions, users);
      request(myApp)
        .post('/add-comment')
        .send('comment=hello')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect(200, done);
    });

    it('should not add a comment for POST /add-comment when session is invalid', (done) => {
      request(myApp)
        .post('/add-comment')
        .send('comment=hello')
        .set('Cookie', 'sessionId=1234')
        .expect('location', '/login')
        .expect(302, done)
    });

    it('should not add comment for POST /add-comment when sessionId is not present', (done) => {
      request(myApp)
        .post('/add-comment')
        .send('comment=hello')
        .expect('location', '/login')
        .expect(302, done)
    });
  });

  describe('GET /api/comments', () => {
    it('should send all the comments for GET /api/comments', (done) => {
      request(myApp)
        .get('/api/comments')
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done)
    });

    it('should send the comments of the provided user for GET /api/comments?name=username', (done) => {
      request(myApp)
        .get('/api/comments?name=bani')
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done)
    });

    it('should send the lastId for GET /api/comments?q=last-id', (done) => {
      request(myApp)
        .get('/api/comments?q=last-id')
        .expect('content-type', /json/)
        .expect(/{"lastId":\d+}/)
        .expect(200, done)
    });

    it('should send all the comments after the provided id for GET /api/comments?after=lastId', (done) => {
      request(myApp)
        .get('/api/comments?after=1')
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done)
    });
  });
});
