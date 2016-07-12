const Hapi = require('hapi');
const Joi = require('joi');
const good = require('good');
const Boom = require('boom');

const getMovieTimes = require('./helpers/movie-times');
const errors = require('./messages/errors');

const server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: process.env.PORT || 8080,
});

server.route({
  method: 'GET',
  path: '/movies',
  handler: (request, reply) => {
    getMovieTimes(request.query.title, request.query.city)
      .then((result) => (result.length > 0 ? result : Boom.notFound(errors.NO_THEATERS_AVAILABLE)))
      .then((result) => reply(result));
  },
  config: {
    validate: {
      query: {
        title: Joi.string().required(),
        city: Joi.string().required(),
      },
    },
  },
});

const options = {
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
};

server.register({
  register: good,
  options,
}, (err) => {
  if (err) {
    server.log(['error'], err);

    throw err;
  }

  server.start(() => {
    server.log(['debug'], `Server started at ${server.info.uri}`);
  });
});

module.exports = server;
