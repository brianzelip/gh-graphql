const fs = require('fs');
const request = require('request');
const CronJob = require('cron').CronJob;

const options = {
  'uri': 'https://api.github.com/graphql',
  'method': 'POST',
  'headers': {
    'User-Agent': 'brianzelip'
  },
  'auth': {
    'bearer': 'token'
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
            issues(first: 100, labels: \"manuscript\") { \
              edges { \
                node { \
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

new CronJob('0 */1 * * * *', function() {
  request(options, function (error, response, body) {
    if (error) {
      return `ERROR!: ${error}`;
    } else if (response.statusCode === 200) {
      console.log('GitHub api was successfully queried 🎉\n');
      fs.writeFile('data.json', body, (err) => {
        if (err) throw err;
        console.log(`data.json was successfully written 🎉\n`);
      });
      let timestamp = new Date();
      const logEntry = `NCBI-Hackathons repos data refresh happened at ${timestamp} 🎉\n`;
      console.log(`timestamp is ${timestamp}`);
      fs.appendFile('data.log', logEntry, (err) => {
        if (err) throw err;
        console.log(`The timestamp ${timestamp} was appended to data.log 🎉\n`);
      })
      return;
    } else {
      return `Problem! Status code = ${response.statusCode}, response = ${response}`;
    };
  });

}, null, true, 'America/New_York');
