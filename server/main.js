const Hapi = require('hapi');
const Joi = require('joi');
const good = require('good');
const Boom = require('boom');

const getMovieTimes = require('./helpers/movie-times');
const errors = require('./messages/errors');

const server = new Hapi.Server();

const config = require('./config');

server.connection({
  host: config.get('/host'),
  port: config.get('/port') || 8080,
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

server.register({
  register: good,
  options: config.get('/good/options'),
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
