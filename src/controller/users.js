'use strict';

import Joi from 'joi';
import Boom from 'boom';
import { User } from '../models';
import uuid from 'uuid';

exports.sendToken = {
  validate: {
    payload: {
      email: Joi.string().email().required()
    }
  },
  handler: async ({ payload }, reply) => {
    const email = payload.email;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        user = new User({ email });
      }

      user.token = uuid.v4();
      await user.save();

      // TODO: Send email token

      return reply().code(204);
    } catch(err) {
      return reply(Boom.badImplementation(err));
    }

  }
};

exports.getUser = {
  auth: 'simple',
  handler: (request, reply) => {
    return reply(request.auth.credentials.toJSON()).code(200);
  }
};

exports.removeToken = {
  auth: 'simple',
  handler: async (request, reply) => {
    let user = request.auth.credentials;
    user.token = null;
    await user.save();
    return reply().code(204);
  }
};

exports.update = {
  auth: 'simple',
  validate: {
    payload: {
      name: Joi.string(),
      email: Joi.any().forbidden(),
      token: Joi.any().forbidden()
    }
  },
  handler: async (request, reply) => {
    let user = request.auth.credentials;
    user.name = request.payload.name;
    await user.save();
    return reply(user.toJSON()).code(200);
  }
};
