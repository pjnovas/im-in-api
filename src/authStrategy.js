import AuthBearer from 'hapi-auth-bearer-token';
import { User } from './models';

export default server => {

  server.register(AuthBearer, err => {
    if (err) return console.log(err);

    server.auth.strategy('simple', 'bearer-access-token', {
      allowQueryToken: false,
      validateFunc: function (token, callback) {

        User.findOne({ token }, (err, user) => {
          if (err) return callback(err);
          if (!user) return callback(null, false);

          return callback(null, true, user);
        });
      }
    });
  });

};
