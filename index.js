const fs = require('fs');
const got = require('got');
var CronJob = require('cron').CronJob;

curl -H "Authorization: bearer token" -X POST -d " \
 { \
   \"query\": \"query {organization(login: \\\"NCBI-Hackathons\\\") {login repositories(first: 100) {totalCount nodes {name license description url updatedAt languages(first: 1) {edges {node {name}}}releases(first: 1) {totalCount}}}}}\"
 } \
" https:\/\/api.github.com\/graphql > data.json
