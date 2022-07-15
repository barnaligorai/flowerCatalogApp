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

  describe('GET /guestbook', () => {
    it('should serve the login page for GET /guestbook when session is not present', (done) => {
      request(myApp)
        .get('/guestbook')
        .expect('location', '/login')
        .expect(302, done);
    });

    it('should serve the guestbook for GET /guestbook when session is valid', (done) => {
      const sessionId = sessions.add('bani');
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);

      request(myApp)
        .get('/guestbook')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect('content-type', /html/)
        .expect(/form/)
        .expect(200, done)
    });

    it('should redirect to the guestbook for GET /guestbook when session is not valid', (done) => {
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);

      request(myApp)
        .get('/guestbook')
        .set('Cookie', ['sessionId=1234'])
        .expect('location', '/login')
        .expect(302, done);
    });
  });

  describe('POST /guestbook/add-comment', () => {
    it('should add a comment in guestbook for POST /guestbook/add-comment when session is valid', (done) => {
      const config = {
        sourceDir: './public',
        templateFile: './resource/guestbookTemplate.html',
        dataFile: './test/testData/dummyGuestBook.json'
      };
      const sessionId = sessions.add('bani');
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/guestbook/add-comment')
        .send('comment=hello')
        .set('Cookie', [`sessionId=${sessionId}`])
        .expect(200, done);
    });

    it('should not add a comment for POST /guestbook/add-comment when session is invalid', (done) => {
      request(myApp)
        .post('/guestbook/add-comment')
        .send('comment=hello')
        .set('Cookie', 'sessionId=1234')
        .expect('location', '/login')
        .expect(302, done)
    });

    it('should not add comment for POST /guestbook/add-comment when sessionId is not present', (done) => {
      request(myApp)
        .post('/guestbook/add-comment')
        .send('comment=hello')
        .expect('location', '/login')
        .expect(302, done)
    });
  });

  describe('GET /guestbook/comments', () => {
    it('should send all the comments for GET /guestbook/comments when user is logged in', (done) => {
      users.push('bani');
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .get('/guestbook/comments')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done);
    });

    it('should send the comments of the provided user for GET /guestbook/comments/name?name=username when user is logged in', (done) => {
      users.push('bani');
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .get('/guestbook/comments/name/bani')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done);
    });

    it('should send the lastId for GET /guestbook/comments/q/last-id when user is logged in', (done) => {
      users.push('bani');
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .get('/guestbook/comments/q/last-id')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect('content-type', /json/)
        .expect(/{"lastId":\d+}/)
        .expect(200, done)
    });

    it('should send all the comments after the provided id for GET /guestbook/comments?after=lastId when user is logged in', (done) => {
      users.push('bani');
      const sessionId = sessions.add('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .get('/guestbook/comments/after/1')
        .set('Cookie', `sessionId=${sessionId}`)
        .expect('content-type', /json/)
        .expect(/^\[.*\]$/)
        .expect(200, done)
    });

    it('should not serve comments for GET /guestbook/comments when user is not logged in', (done) => {
      request(myApp)
        .get('/guestbook/comments')
        .expect('location', /login/)
        .expect(302, done)
    });
  });

  describe('POST /login', () => {
    it('should redirect the user to register page for POST /login when user is not registered', (done) => {
      request(myApp)
        .post('/login')
        .send('username=bani')
        .expect('location', '/register')
        .expect(302, done);
    });

    it('should log the user in for POST /login when user is valid', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/login')
        .send('username=bani')
        .expect('location', '/guestbook')
        .expect(302, done);
    });

    it('should redirect to registration page for POST /login when user is not valid', (done) => {
      users.push('bani');
      const myApp = app(config, sessions, users, mockedLogger);
      request(myApp)
        .post('/login')
        .send('username=barnali')
        .expect('location', '/register')
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
    it('should not register the user for POST /register when the username is not provided', (done) => {
      request(myApp)
        .post('/register')
        .expect('Provide username')
        .expect(400, done);
    });

    it('should register the user for POST /register when the user is new', (done) => {
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

    it('should not register the user for POST /register when the username already exists', (done) => {
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
