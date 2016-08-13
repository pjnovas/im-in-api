
let config;

try {
  switch (process.env.NODE_ENV){
    case 'production': {
      config = require('./config.prod.json');
      break;
    }
    case 'test': {
      config = require('./config.test.json');
      break;
    }
    default: {
      config = require('./config.dev.json');
      break;
    }
  }

  config.env = process.env.NODE_ENV || 'development';
}
catch (e){
  throw new Error('Expected configuration file at ./src/config/config.[env].json');
}

export default config;
