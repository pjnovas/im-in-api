
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
}
catch (e){
  throw new Error('Expected configuration file at ./src/config/config.[env].json');
}

export default config;
