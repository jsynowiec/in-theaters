const request = require('request-promise');
const cheerio = require('cheerio');

const illegalCharacters = /\u200B|\u200C|\u200D|\uFEFF|\u200E|\u200F/gi;

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
        name: $('.name', el).text().replace(illegalCharacters, '')
          .trim(),
        address: $('.address', el).text().replace(illegalCharacters, '')
          .trim(),
        times: $('.times', el).text()
          .split(' ')
          .filter((time) => /(\d{1,2}:\d{1,2})(pm)?/ig.test(time))
          .map((time) => time.replace(illegalCharacters, '').trim()),
      };

      if (theater.times.length > 0) {
        theaters.push(theater);
      }
    });

    return theaters;
  });
};
