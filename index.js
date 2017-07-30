const fs = require('fs');
const request = require('request');

// curl -H "Authorization: bearer 159432c7e188822c3440f09b714e0e3c75839ac7" -X POST -d " \
//  { \
//    \"query\": \"query {organization(login: \\\"NCBI-Hackathons\\\") {login repositories(first: 100) {totalCount nodes {name description url languages(first: 1) {edges {node {name}}}releases(first: 1) {totalCount}}}}}\"
//  } \
// " https:\/\/api.github.com\/graphql > data.json


// the Request docs seem to conflate Authorization and Header, although technically Authentication is a request header -- does this fact mean that they are peers, not parent-child?


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
