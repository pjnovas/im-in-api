
import { Server } from 'hapi';
import { server as serverConfig } from './config';
import database from './database';
import { env, mailer } from './config';

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
    console.log(`ENV [${env}] || MAILER client at ${mailer.tokens.host}`);
    console.log('API up and running at:', server.info.uri);
  });

});

export default server;
