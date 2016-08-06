
import { generate } from 'shortid';

export default {
  identity: 'meeting',
  connection: 'iminDB',
  attributes: {
    id: {
      type: 'string',
      primaryKey: true,
      unique: true,
      defaultsTo: () => generate()
    },
    title: {
      type : 'string',
      required : true
    },
    info: {
      type : 'string'
    },
    owner: {
      type : 'email',
      required : true
    },
    datetime: {
      type : 'number',
      required : true
    },
    max: {
      type : 'number',
      defaultsTo: 0
    },
    location: {
      type : 'string',
      required : true
    },
    attendants: {
      type : 'array',
      defaultsTo: []
    }
  }
};
