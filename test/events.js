
//import mongoose from 'mongoose';

import chai from 'chai';
import chaiHttp from 'chai-http';

import { User, Event } from '../src/models';

const server = require('../src/index');
const expect = chai.expect;

import mongoose from 'mongoose';
import shortid from 'shortid';

chai.use(chaiHttp);

const clearDB = done => {
  User.remove({}, () => {
    Event.remove({}, done);
  });
};

const createUser = (email, done) => {
  // Create User
  chai.request(server.listener)
    .post('/auth')
    .send({ email })
    .end((err, res) => {
      // Get User data
      User.findOne({ email }, (err, user) => done(user));
    });
};

describe('Events', () => {
  let eventCreator;
  let testEvent;
  let commonUsers = [];

  before( done => {
    clearDB( () => {
      let email = 'owner@example.com';

      createUser(email, user => {
        eventCreator = user;

        createUser('test1@example.com', user => {
          commonUsers.push(user);
          done();
        });
      });

    });
  });

  after(clearDB);

  describe('POST /events', () => {

    it('must allow to create an event', done => {
      const event = {
        title: 'Event Title',
        datetime: (new Date).toISOString(),
        location: 'Some point in somewhere',
        info: 'Event Description',
        max: 8
      };

      chai.request(server.listener)
        .post('/events')
        .send(event)
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          let created = res.body;

          expect(created.id).to.be.ok;
          expect(created.sid).to.be.ok;
          expect(created.owner).to.be.equal(eventCreator.id);

          Object.keys(event).forEach( k => {
            expect(created[k]).to.be.equal(event[k]);
          });

          testEvent = created;

          done();
        });
    });

  });

  describe('GET /events/{sid}', () => {

    it('must allow to get an event by its short-id', done => {
      chai.request(server.listener)
        .get(`/events/${testEvent.sid}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          let event = res.body;

          expect(event.id).to.be.equal(testEvent.id);
          expect(event.sid).to.be.equal(testEvent.sid);
          expect(event.owner).to.be.equal(eventCreator.id);

          Object.keys(event).forEach( k => {
            expect(event[k]).to.be.equal(testEvent[k]);
          });

          done();
        });
    });

    it('must return 404 if not found', done => {
      chai.request(server.listener)
        .get('/events/12345')
        .end((err, res) => {
          expect(res.status).to.be.equal(404);

          let fakeId = mongoose.Types.ObjectId();
          chai.request(server.listener)
            .get(`/events/${fakeId}`)
            .end((err, res) => {
              expect(res.status).to.be.equal(404);
              done();
            });
        });
    });

  });

  describe('GET /events', () => {

    it('must return the events created by authenticated user', done => {
      chai.request(server.listener)
        .get('/events')
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          let events = res.body;

          expect(events).to.be.an('array');
          expect(events.length).to.be.equal(1);
          expect(events[0].owner).to.be.equal(eventCreator.id);

          done();
        });
    });

  });

  describe('PUT /events/{id}', () => {

    it('must allow to update an event by sid', done => {
      const eventUpd = {
        title: 'Event Title Upd',
        datetime: (new Date).toISOString(),
        location: 'Some point in somewhere Upd',
        info: 'Event Description Upd',
        max: 20
      };

      chai.request(server.listener)
        .put(`/events/${testEvent.sid}`)
        .send(eventUpd)
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(200);
          let event = res.body;

          expect(event.id).to.be.equal(testEvent.id);
          expect(event.sid).to.be.equal(testEvent.sid);
          expect(event.owner).to.be.equal(eventCreator.id);

          Object.keys(eventUpd).forEach( k => {
            expect(eventUpd[k]).to.be.equal(event[k]);
          });

          done();
        });
    });

    it('must NOT allow to update an event if is the not owner', done => {
      chai.request(server.listener)
        .put(`/events/${testEvent.sid}`)
        .send({})
        .set('Authorization', `Bearer ${commonUsers[0].token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(403);
          done();
        });
    });

    it('must return 404 if not found', done => {
      chai.request(server.listener)
        .put('/events/12345')
        .send({})
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);

          let fakeId = shortid.generate();
          chai.request(server.listener)
            .put(`/events/${fakeId}`)
            .send({})
            .set('Authorization', `Bearer ${eventCreator.token}`)
            .end((err, res) => {
              expect(res.status).to.be.equal(404);
              done();
            });
        });
    });

  });

  describe('DELETE /events/{sid}', () => {

    it('must NOT allow to delete an event if is the not owner', done => {
      chai.request(server.listener)
        .delete(`/events/${testEvent.sid}`)
        .set('Authorization', `Bearer ${commonUsers[0].token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(403);
          done();
        });
    });

    it('must return 404 if not found', done => {
      chai.request(server.listener)
        .delete('/events/12345')
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(404);

          let fakeId = shortid.generate();
          chai.request(server.listener)
            .delete(`/events/${fakeId}`)
            .set('Authorization', `Bearer ${eventCreator.token}`)
            .end((err, res) => {
              expect(res.status).to.be.equal(404);
              done();
            });
        });
    });

    it('must allow to delete an event by sid', done => {
      chai.request(server.listener)
        .delete(`/events/${testEvent.sid}`)
        .set('Authorization', `Bearer ${eventCreator.token}`)
        .end((err, res) => {
          expect(res.status).to.be.equal(204);
          expect(res.body).to.be.empty;
          done();
        });
    });

  });



});
