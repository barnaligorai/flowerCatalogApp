const request = require('supertest');
const { createApp: app } = require('../src/app.js');
const { Sessions } = require('../src/sessions.js');

const assert = require('assert');

const mockedLogger = (method, url) => { };

describe('app', () => {
  let config;
  let sessions;
  let users;
  let myApp;

  beforeEach(() => {
    config = {
      sourceDir: './public',
      templateFile: './resource/guestbookTemplate.html',
      dataFile: './data/guestBook.json'
    };
    sessions = new Sessions();
    users = [];
    myApp = app(config, sessions, users, mockedLogger);
  });

  describe('GET /wrongUrl', () => {
    it('should serve notFound page for GET /wrongUrl', (done) => {
      request(myApp)
        .get('/wrongUrl')
        .expect('content-type', /html/)
        .expect(/Cannot GET/)
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
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect('content-type', /html/)
        .expect(/form/)
        .expect(200, done)
    });

    it('should serve the guestbook for GET /guestbook.html when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);

      request(myApp)
        .get('/guestbook.html')
        .set('Cookie', ['sessionId=1234'])
        .expect('location', '/login')
        .expect('need to login')
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
      const myApp = app(config, sessions, users, mockedLogger);
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
        .expect(200, done);
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
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/login')
        .send('username=bani')
        .expect('location', '/guestbook.html')
        .expect(/redirect/)
        .expect(302, done);
    });

    it('should redirect to registration page for POST /login when user is not valid', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/login')
        .send('username=barnali')
        .expect('location', '/register')
        .expect(/redirect/)
        .expect(302, done);
    });
  });

  describe('GET /logout', () => {
    it('should redirect to login page for GET /logout when user is not already logged in', (done) => {
      request(myApp)
        .get('/logout')
        .expect('location', '/login')
        .expect(/Redirect/)
        .expect(302, done);
    });

    it('should log the user out for GET /logout when user is already logged in', (done) => {
      const sessionId = sessions.add('bani');
      request(myApp)
        .get('/logout')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect('location', '/login')
        .expect(/Redirect/)
        .expect(302, done);
    });
  });

  describe('POST /register', () => {
    it('should not register the user for POST /register if the username is not provided', (done) => {
      request(myApp)
        .post('/register')
        .expect('Provide username')
        .expect(400, done);
    });

    it('should register the user for POST /register if the user is new', (done) => {
      request(myApp)
        .post('/register')
        .send('username=bani')
        .expect(/successful/)
        .expect(200)
        .end((err, res) => {
          assert.deepStrictEqual(users, ['bani']);
          done();
        });
    });

    it('should register the user for POST /register if the user is new', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/register')
        .send('username=bani')
        .expect(/exists/)
        .expect(200)
        .end(() => {
          assert.deepStrictEqual(users, ['bani']);
          done();
        });
    });
  });
});
