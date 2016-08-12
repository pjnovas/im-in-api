import mongoose from 'mongoose';
import Promise from 'bluebird';
import config from './config';

const dbUrl = `mongodb://${config.database.host}/${config.database.db}`;
mongoose.connect(dbUrl);

mongoose.Promise = Promise;

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));

db.once('open', function callback() {
  console.log(`Connection with database ${dbUrl} succeeded.`);
});

exports.mongoose = mongoose;
exports.db = db;
