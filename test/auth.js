
//import mongoose from 'mongoose';

import chai from 'chai';
import chaiHttp from 'chai-http';

import { User } from '../src/models';

const server = require('../src/index');
const expect = chai.expect;

chai.use(chaiHttp);

const clearDB = done => {
  User.remove({}, done);
};

describe('Auth', () => {
  let email = 'test@example.com'; // Test User Email.

  before(clearDB);
  after(clearDB);

  describe('POST /auth', () => {

    it('must validate payload', done => {
      chai.request(server.listener)
        .post('/auth')
        .send({ email: 'not-an-email' })
        .end((err, res) => {
          expect(res.status).to.be.equal(400);

          var validation = res.body.validation;
          expect(validation).to.be.an('object');
          expect(validation.source).to.be.equal('payload');
          expect(validation.keys.indexOf('email') > -1).to.be.true;
          done();
        });
    });

    it('must create a user with a token', done => {

      chai.request(server.listener)
        .post('/auth')
        .send({ email })
        .end((err, res) => {

          expect(res.status).to.be.equal(204);
          expect(res.body).to.be.empty;

          User.findOne({ email }, (err, user) => {
            expect(err).to.not.be.ok;
            expect(user).to.be.ok;
            expect(user.email).to.be.equal(email);
            expect(user.token).to.be.ok;
            done();
          });

        });
    });

    it('must use existing user and create a new token', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        let prevToken = user.token;

        chai.request(server.listener)
          .post('/auth')
          .send({ email })
          .end((err, res) => {
            expect(res.status).to.be.equal(204);
            expect(res.body).to.be.empty;

            User.findOne({ email }, (err, user) => {
              expect(err).to.not.be.ok;
              expect(user).to.be.ok;
              expect(user.email).to.be.equal(email);
              expect(user.token).to.be.ok;
              expect(user.token).to.not.be.equal(prevToken);
              done();
            });
          });
      });

    });

  });

  describe('GET /auth', () => {

    it('must validate authorization header and unauthorize an invalid request', done => {
      chai.request(server.listener)
        .get('/auth')
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).to.be.ok;
          expect(res.body.message).to.equal('Missing authentication');
          done();
        });
    });

    it('must validate token and unauthorize an invalid token', done => {
      chai.request(server.listener)
        .get('/auth')
        .set('Authorization', 'Bearer 1234')
        .end((err, res) => {
          expect(res.status).to.be.equal(401);
          expect(res.body).to.be.ok;
          expect(res.body.attributes.error).to.equal('Bad token');
          done();
        });
    });

    it('must validate token and retrieve the user data', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        chai.request(server.listener)
          .get('/auth')
          .set('Authorization', `Bearer ${user.token}`)
          .end((err, res) => {
            expect(res.status).to.be.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body.email).to.be.equal(email);
            expect(res.body.token).to.be.ok;
            done();
          });

      });
    });

  });

  describe('PUT or PATCH /auth', () => {

    it('must allow to update users data', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        const sendUpdate = (type, name, _done) => {

          chai.request(server.listener)
            [type]('/auth')
            .send({ name })
            .set('Authorization', `Bearer ${user.token}`)
            .end((err, res) => {
              expect(res.status).to.be.equal(200);
              expect(res.body).to.be.an('object');
              expect(res.body.email).to.be.equal(email);
              expect(res.body.token).to.be.equal(user.token);
              expect(res.body.name).to.be.equal(name);

              _done();
            });
        };

        sendUpdate('put', 'My Name 1', () => {
          sendUpdate('patch', 'My Name 1', done);
        });

      });

    });

    it('must not allow [email] as payload', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        chai.request(server.listener)
          .put('/auth')
          .send({ email: 'new_email@example.com' })
          .set('Authorization', `Bearer ${user.token}`)
          .end((err, res) => {
            expect(res.status).to.be.equal(400);
            expect(res.body.message).to.contain('"email" is not allowed');
            done();
          });

      });

    });

    it('must not allow [token] as payload', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        chai.request(server.listener)
          .put('/auth')
          .send({ token: 'new-magic-token' })
          .set('Authorization', `Bearer ${user.token}`)
          .end((err, res) => {
            expect(res.status).to.be.equal(400);
            expect(res.body.message).to.contain('"token" is not allowed');
            done();
          });

      });

    });

  });


  describe('DELETE /auth', () => {

    it('must destroy user token', done => {

      User.findOne({ email }, (err, user) => {
        expect(err).to.not.be.ok;
        expect(user).to.be.ok;
        expect(user.token).to.be.ok;

        chai.request(server.listener)
          .delete('/auth')
          .set('Authorization', `Bearer ${user.token}`)
          .end((err, res) => {
            expect(res.status).to.be.equal(204);
            expect(res.body).to.be.empty;

            // Subsequent call must return unauthorized
            chai.request(server.listener)
              .get('/auth')
              .set('Authorization', `Bearer ${user.token}`)
              .end((err, res) => {
                expect(res.status).to.be.equal(401);
                done();
              });
          });

      });

    });

  });



});
