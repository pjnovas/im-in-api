'use strict';

import Joi from 'joi';
import Boom from 'boom';
import { Event } from '../models';
import chain from './chain';

const fetchEvent = async (request, reply) => {
  try {
    let event =
      await Event
        .findOne({sid: request.params.sid})
        .populate('owner', 'id name')
        .populate('attendants', 'id name');

    if (!event) {
      return reply(Boom.notFound());
    }

    request.event = event;
    reply.next();

  } catch(err) {
    if (err.name === 'CastError') return reply(Boom.notFound());
    return reply(Boom.badImplementation(err));
  }
};

const isEventOwner = async (request, reply) => {
  if (request.event.owner.id.toString() !== request.auth.credentials.id.toString()){
    return reply(Boom.forbidden('only owner can change this event'));
  }

  reply.next();
};

exports.getMine = {
  auth: 'simple',
  handler: async (request, reply) => {
    try {
      let events = await Event.find({ owner: request.auth.credentials.id });
      return reply(events.map( e => e.toJSON())).code(200);
    } catch(err) {
      return reply(Boom.badImplementation(err));
    }
  }
};

exports.getOne = {
  handler: chain(fetchEvent,
    (request, reply) => reply(request.event.toJSON()).code(200))
};

exports.create = {
  validate: {
    payload: {
      title: Joi.string().required(),
      datetime: Joi.date().required(),
      location: Joi.string().required(),
      info: Joi.string(),
      max: Joi.number(),

      owner: Joi.any().forbidden(),
      id: Joi.any().forbidden()
    }
  },
  auth: 'simple',
  handler: async (request, reply) => {
    try {
      delete request.payload.attendants;

      let event = new Event(request.payload);
      event.owner = request.auth.credentials.id;
      event.attendants.push(event.owner);
      await event.save();

      return reply(event.toJSON()).code(200);
    } catch(err) {
      return reply(Boom.badImplementation(err));
    }
  }
};

exports.update = {
  validate: {
    payload: {
      title: Joi.string(),
      datetime: Joi.date(),
      location: Joi.string(),
      info: Joi.string(),
      max: Joi.number(),

      owner: Joi.any().forbidden()
    }
  },
  auth: 'simple',
  handler: chain(fetchEvent, isEventOwner, async (request, reply) => {
    delete request.payload._id;
    delete request.payload.id;
    delete request.payload.sid;
    delete request.payload.attendants;

    request.event.set(request.payload);
    await request.event.save();

    return reply(request.event.toJSON()).code(200);
  })
};

exports.remove = {
  auth: 'simple',
  handler: chain(fetchEvent, isEventOwner, async (request, reply) => {
    await request.event.remove();
    return reply().code(204);
  })
};

exports.join = {
  auth: 'simple',
  handler: chain(fetchEvent, async (request, reply) => {
    let newAtt = request.auth.credentials.id;
    let exist = request.event.attendants.some( att => {
      return att.id.toString() === newAtt.toString();
    });

    if (!exist){
      request.event.attendants.push(newAtt);
      await request.event.save();
    }
    return reply().code(204);
  })
};

exports.leave = {
  auth: 'simple',
  handler: chain(fetchEvent, async (request, reply) => {
    let removeAtt = request.auth.credentials.id;
    request.event.attendants.remove(removeAtt);
    await request.event.save();
    return reply().code(204);
  })
};
