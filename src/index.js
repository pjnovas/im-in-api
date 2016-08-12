
import { Server } from 'hapi';
import { server as serverConfig } from './config';
import database from './database';

const server = new Server();

let { port, host } = serverConfig;
server.connection({ port, host, routes: { cors: true } });

require('./authStrategy')(server);

server.register([{
  register : require('blipp')
}], err => {
  if (err) { return console.log(err); }

  server.route(require('./routes'));

  server.start(() => {
    console.log('API up and running at:', server.info.uri);
  });

});

export default server;
