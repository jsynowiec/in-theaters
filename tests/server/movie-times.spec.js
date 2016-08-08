/* eslint-env node, mocha */
/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const expect = require('chai').expect;
const nock = require('nock');

const getMovieTimes = require('../../server/helpers/movie-times');

describe('Movie showtimes', () => {
  let response;

  before((done) => {
    nock('https://www.google.com')
      .get('/movies')
      .query(true)
      .replyWithFile(200, `${__dirname}/fixtures/google-movies-response.html`);

    getMovieTimes('now you see me 2', 'chicago')
      .then((result) => {
        response = result;

        done();
      });
  });

  after((done) => {
    nock.cleanAll();

    done();
  });

  it('should return an Array', () => {
    expect(response).to.be.instanceof(Array);
  });

  it('should contain 6 theaters', () => {
    expect(response.length).to.equal(6);
  });

  it('should return Kerasotes ShowPlace ICON Theatre as first', () => {
    const theater = response[0];

    expect(theater.name).to.equal('Kerasotes ShowPlace ICON Theatre - Chicago');
    expect(theater.address)
      .to.equal('1011 South Delano Court East, Chicago, IL, United States');
  });

  it('should return 2 showtimes for Kerasotes ShowPlace ICON Theatre', () => {
    const theater = response[0];

    expect(theater.times.length).to.equal(2);
  });

  it('should return 2:15 and 8:10pm as showtimes for Kerasotes ShowPlace ICON Theatre', () => {
    const theater = response[0];

    expect(theater.times[0]).to.equal('2:15');
    expect(theater.times[1]).to.equal('8:10pm');
  });
});
