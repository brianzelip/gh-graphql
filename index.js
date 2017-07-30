const fs = require('fs');
const request = require('request');

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
}

request(options, function (error, response, body) {
  if (error) {
    return `ERROR!: ${error}`;
  } else if (response.statusCode === 200) {
    console.log('GitHub api was successfully queried 🎉\n');
    fs.writeFile('data.json', body, (err) => {
      if (err) throw err;
      console.log(`data.json was successfully written 🎉\n`);
    });
    return;
  } else {
    return `Problem! Status code = ${response.statusCode}, response = ${response}`;
  };
});
