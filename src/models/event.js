
import { generate } from 'shortid';

export default {
  identity: 'event',
  connection: 'iminDB',
  tableName: 'events',
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
      type : 'datetime',
      required : true
    },
    max: {
      type : 'integer'
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
