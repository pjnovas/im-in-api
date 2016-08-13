
import { env, mailer } from '../config';
import { createTransport } from 'nodemailer';

const transport = createTransport(mailer.transport);

exports.sendToken = (user, done) => {
  const url = `${mailer.tokens.host}?token=${user.token}&uid=${encodeURIComponent(user.id)}`;

  const mailOpts = {
    from: mailer.tokens.sender,
    to: user.email,
    subject: 'Login',
    text: `Hey!, Access your account at: ${url}`,
    html: `Hey!, Access your account at: ${url}`
  };

  if (env === 'production'){
    return transport.sendMail(mailOpts, done);
  }

  if (env === 'development'){
    console.log(`EMAIL TO ${user.email} :: ${url}`);
  }

  done();
};
