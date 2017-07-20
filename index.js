const fs = require('fs');
const got = require('got');
var CronJob = require('cron').CronJob;



curl -H "Authorization: bearer token" -X POST -d " \
 { \
   \"query\": \"query { viewer { login }}\" \
 } \
" https:\/\/api.github.com\/graphql
