import AuthBearer from 'hapi-auth-bearer-token';

export default server => {

  server.register(AuthBearer, err => {
    if (err){
      console.log(err);
      return;
    }

    server.auth.strategy('simple', 'bearer-access-token', {
      allowQueryToken: false,              // optional, true by default
      //allowMultipleHeaders: false,        // optional, false by default
      //accessTokenName: 'access_token',    // optional, 'access_token' by default
      validateFunc: function (token, callback) {
        //var request = this;

        // TODO: Validate Token
        if (token === "1234") {
          return callback(null, true, { token });
        }

        callback(null, false, { token });
      }
    });
  });

};
