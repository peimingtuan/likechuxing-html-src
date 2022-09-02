const ENV = require('./env.js')

export default function (url) {
  let host = 'https://activity.likechuxing.com'
  if (ENV === 'dev') host = 'https://h5test.likechuxing.com'
  return host + url
}