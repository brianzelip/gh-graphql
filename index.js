const cors = require('cors');
const CronJob = require('cron').CronJob;
const express = require('express');
const fs = require('fs');
const request = require('request');

const app = express();

const options = {
  'uri': 'https://api.github.com/graphql',
  'method': 'POST',
  'headers': {
    'User-Agent': 'brianzelip'
  },
  'auth': {
    'bearer': process.env.TOKEN
  },
  'body': JSON.stringify({
    "query": "query { \
      organization(login: \"NCBI-Hackathons\") { \
        login \
        repositories(first: 100) { \
          totalCount \
          nodes { \
            name \
            description \
            url \
            languages(first: 1) { \
              edges { \
                node { \
                  name \
                } \
              } \
            } \
            releases(first: 1) { \
              totalCount \
            } \
            issues(first: 100, labels: [\"manuscript\", \"title\"]) { \
              edges { \
                node { \
                  title \
                  body \
                } \
              } \
            } \
          } \
        } \
      } \
    }"
  }),
};

new CronJob('30 */4 * * * *', function() {
  request(options, function (error, response, body) {
    if (error) {
      return `ERROR!: ${error}`;
    } else if (response.statusCode === 200) {
      console.log('GitHub api was successfully queried 🎉\n');
      fs.writeFile('.data/data.json', body, (err) => {
        if (err) throw err;
        console.log(`.data/data.json was successfully written 🎉\n`);
      });
      let timestamp = new Date();
      const logEntry = `NCBI-Hackathons repos data refresh happened at ${timestamp} 🎉\n`;
      console.log(`timestamp is ${timestamp}`);
      fs.appendFile('.data/data.log', logEntry, (err) => {
        if (err) throw err;
        console.log(`The timestamp ${timestamp} was appended to .data/data.log 🎉\n`);
      })
      return;
    } else {
      return `Problem! Status code = ${response.statusCode}, response = ${response}`;
    };
  });

}, null, true, 'America/New_York');


/*
  Thanks @Tim! https://support.glitch.com/t/expose-a-json-file-for-consumption/1843
*/

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

// When client hits my-site.glitch.me/data, return document
app.get("/data", cors(), function (request, response) {
  response.sendFile(__dirname + '/.data/data.json');
});

// When client hits my-site.glitch.me/log, return document
app.get("/log", function (request, response) {
  response.sendFile(__dirname + '/.data/data.log');
});
