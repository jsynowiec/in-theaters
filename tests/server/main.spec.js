/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const expect = require('chai').expect;
const nock = require('nock');

const server = require('../../server/main');

const errors = require('../../server/messages/errors');

describe('In Theaters API', () => {
  // Setup
  before((done) => {
    nock('https://www.google.com')
      .get('/movies?hl=en&near=chicago&q=now%20you%20see%20me%202')
      .replyWithFile(200, `${__dirname}/fixtures/google-movies-response.html`)
      .get('/movies?hl=en&near=washington&q=infiltrator')
      .reply(200, '');

    done();
  });

  // Teardown
  after((done) => {
    nock.cleanAll();

    done();
  });

  it('should fail with status code 400 if title is missing', (done) => {
    const options = {
      method: 'GET',
      url: '/movies',
    };

    server.inject(options)
      .then((response) => {
        const payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(400);
        expect(payload.error).to.equal('Bad Request');
        expect(payload.message).to
          .equal('child "title" fails because ["title" is required]');

        done();
      });
  });

  it('should fail with status code 400 if title is present but city is missing', (done) => {
    const options = {
      method: 'GET',
      url: '/movies?title=now you see me 2',
    };

    server.inject(options)
      .then((response) => {
        const payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(400);
        expect(payload.error).to.equal('Bad Request');
        expect(payload.message).to
          .equal('child "city" fails because ["city" is required]');

        done();
      });
  });

  it('should respond with status code 404 and error message if no theaters were found', (done) => {
    const options = {
      method: 'GET',
      url: '/movies?title=infiltrator&city=washington',
    };

    server.inject(options, (response) => {
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(404);
      expect(payload.message).to
        .equal(errors.NO_THEATERS_AVAILABLE);

      done();
    });
  });

  it('should respond with status code 200 and theaters array', (done) => {
    const options = {
      method: 'GET',
      url: '/movies?title=now you see me 2&city=chicago',
    };

    server.inject(options)
      .then((response) => {
        const payload = JSON.parse(response.payload);

        expect(response.statusCode).to.equal(200);
        expect(payload).to.be.instanceof(Array);

        done();
      });
  });
});
