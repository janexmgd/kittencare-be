import supertest from 'supertest';
import { describe, it, before, afterEach, after } from 'mocha';
import { faker } from '@faker-js/faker';
import server from '../server.js';
import { expect } from 'chai';
import env from '../utils/env.js';
import db from '../config/pg.js';

if (env.NODE_ENV !== 'test') {
  console.log('Cant run test without NODE_ENV=test');
  process.exit(0);
}

const password = faker.internet.password();
const gender = Math.random() > 0.5 ? 'man' : 'woman';
let userData = {
  fullName: faker.person.fullName(),
  email: faker.internet.email(),
  password: password,
  confirmPassword: password,
  username: faker.internet.username(),
  gender: gender,
  job: faker.person.jobTitle(),
  dob: faker.date.past(20),
};

let app;

before(async () => {
  try {
    await db.connect();
    console.log('Connected to PostgreSQL database');
  } catch (err) {
    console.error('Failed to connect to the PostgreSQL database', err);
    process.exit(1);
  }
  let port = 6789;
  await new Promise((resolve, reject) => {
    app = server.listen(port, '0.0.0.0', () => {
      console.log('App running at port ' + port);
      resolve();
    });
  });
});

describe('GET /', () => {
  describe('Test index', () => {
    it('should be ok at app', async () => {
      const response = await supertest(server).get('/').expect(200);
      expect(response.body.status).to.equal(
        'ok',
        'Expected status to be "ok", but got ' + response.body.status
      );
      expect(response.body.message).to.equal(
        'app running normally',
        'Expected message to be "app running normally", but got ' +
          response.body.message
      );
    });
  });
});

describe('POST /auth/register', () => {
  it('should register a new user successfully', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send(userData)
      .expect(200);

    expect(response.body)
      .to.have.property('status')
      .equals(
        'success',
        'Expected response status to be "success", but got ' +
          response.body.status
      );

    expect(response.body)
      .to.have.property('message')
      .equals(
        'success register',
        'Expected message to be "success register", but got ' +
          response.body.message
      );

    expect(response.body.data)
      .to.have.property('email')
      .equals(
        userData.email,
        'Expected email to be ' +
          userData.email +
          ', but got ' +
          response.body.data.email
      );
  });

  it('should return error if email is already registered', async () => {
    const response = await supertest(app)
      .post('/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body)
      .to.have.property('status')
      .equals(
        'failed',
        'Expected response status to be "failed", but got ' +
          response.body.status
      );

    expect(response.body)
      .to.have.property('message')
      .equals(
        'email is already registered',
        'Expected message to be "email is already registered", but got ' +
          response.body.message
      );
  });

  it('should return error if username is already taken', async () => {
    userData.email = 'emailtest@123mail.com';
    const response = await supertest(app)
      .post('/auth/register')
      .send(userData)
      .expect(400);

    expect(response.body)
      .to.have.property('status')
      .equals(
        'failed',
        'Expected response status to be "failed", but got ' +
          response.body.status
      );

    expect(response.body)
      .to.have.property('message')
      .equals(
        'username already taken',
        'Expected message to be "username already taken", but got ' +
          response.body.message
      );
  });
});

after(async () => {
  await app.close();
  process.exit(0);
});
