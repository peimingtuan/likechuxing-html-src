const ENV = require('./env.js')

export default function(url){
  let host = 'https://activityapi.likechuxing.com'
  if(ENV === 'dev') host = 'https://apitest.likechuxing.com'
  return host+url
}