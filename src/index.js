
import { Server } from 'hapi';
const server = new Server();

server.connection({ port: 1337, host: 'localhost', routes: { cors: true } });

var dogwaterOptions = {
  connections: {
    iminDB : {
      adapter: 'iminMongo',
      //host: 'localhost',
      //port: 27017,
      database: 'imin'
    }
  },
  adapters:{
    iminMongo : 'sails-mongo'
  },
  models: require('./models')
};

server.register([{
    register : require('blipp')
  },{
    register: require('dogwater'),
    options: dogwaterOptions
  },{
    register: require('bedwetter'),
    options: {}
  }
], err => {
    if (err) { return console.log(err); }

    server.route(require('./routes'));

    server.start(() => {
      console.log('API up and running at:', server.info.uri);
    });
});
