
import { generate } from 'shortid';

export default {
  identity: 'event',
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
      required : false //true
    },
    max: {
      type : 'number'
    },
    location: {
      type : 'string',
      required : false //true
    },
    attendants: {
      type : 'array',
      defaultsTo: []
    }
  }
};
