'use strict';

import Joi from 'joi';
import Boom from 'boom';
import { Event } from '../models';
import chain from './chain';

const fetchEvent = async (request, reply) => {
  try {
    let event = await Event.findOne({sid: request.params.sid});

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
  if (request.event.owner.toString() !== request.auth.credentials.id.toString()){
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
      let event = new Event(request.payload);
      event.owner = request.auth.credentials.id;
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
