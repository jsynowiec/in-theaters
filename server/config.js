const Confidence = require('confidence');
const store = new Confidence.Store();

store.load({
  host: '0.0.0.0',
  port: process.env.PORT,
  good: {
    options: {
      $filter: 'env',
      production: {
        ops: {
          interval: 1000,
        },
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: 'error', response: '*' }],
          }, {
            module: 'good-console',
          }, 'stdout'],
        },
      },
      testing: {
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: 'error' }],
          }, {
            module: 'good-console',
          }, 'stdout'],
        },
      },
      $default: {
        ops: {
          interval: 1000,
        },
        reporters: {
          console: [{
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{ log: '*', response: '*' }],
          }, {
            module: 'good-console',
          }, 'stdout'],
        },
      },
    },
  },
});

module.exports = {
  get: (key, criteria = {}) => {
    Object.assign(criteria, { env: process.env.NODE_ENV });
    return store.get(key, criteria);
  },
};
