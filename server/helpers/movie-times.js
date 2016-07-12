const request = require('request-promise');
const cheerio = require('cheerio');

module.exports = function getMovieTimes(title, city, language = 'en') {
  return request({
    uri: 'https://www.google.com/movies',
    qs: {
      hl: language,
      near: city,
      q: title,
    },
  }).then((htmlString) => {
    const $ = cheerio.load(htmlString);
    const theaters = [];

    // Scrape movie times and theater names
    $('.theater').each((i, el) => {
      const theater = {
        name: $('.name', el).text(),
        address: $('.address', el).text(),
        times: $('.times', el).text()
          .split(' ')
          .map((time) => time.trim()),
      };

      if (theater.times.length > 0) {
        theaters.push(theater);
      }
    });

    return theaters;
  });
};
