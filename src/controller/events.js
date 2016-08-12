'use strict';

import Joi from 'joi';
import Boom from 'boom';
import { Event } from '../models';

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
  handler: async (request, reply) => {
    try {
      let event = await Event.findById(request.params.id);

      if (!event) {
        return reply(Boom.notFound());
      }

      return reply(event.toJSON()).code(200);
    } catch(err) {
      if (err.name === 'CastError') return reply(Boom.notFound());
      return reply(Boom.badImplementation(err));
    }
  }
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
  handler: async (request, reply) => {

    try {
      let event = await Event.findById(request.params.id);

      if (!event) {
        return reply(Boom.notFound());
      }

      if (event.owner.toString() !== request.auth.credentials.id.toString()){
        return reply(Boom.forbidden('only owner can change this event'));
      }

      delete request.payload._id;
      delete request.payload.id;

      event.set(request.payload);
      await event.save();

      return reply(event.toJSON()).code(200);
    } catch(err) {
      if (err.name === 'CastError') return reply(Boom.notFound());
      return reply(Boom.badImplementation(err));
    }
  }
};

exports.remove = {
  auth: 'simple',
  handler: async (request, reply) => {
    try {
      let event = await Event.findById(request.params.id);

      if (!event) {
        return reply(Boom.notFound());
      }

      if (event.owner.toString() !== request.auth.credentials.id.toString()){
        return reply(Boom.forbidden('only owner can delete this event'));
      }

      await event.remove();
      return reply().code(204);
    } catch(err) {
      if (err.name === 'CastError') return reply(Boom.notFound());
      return reply(Boom.badImplementation(err));
    }
  }
};
