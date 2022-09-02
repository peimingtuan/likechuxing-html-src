/**
 * Created by garvey on 2017/6/23.
 */
const HOST = {
  production: [
    /h5\.likechuxing\.com/
  ],
  development: [
    /h5test\.likechuxing\.com/,
    /test/
  ]
}
let url = window.location.origin

function getEnv () {
  if (HOST.production.some(item => item.test(url))) {
    return 'production'
  }
  if (HOST.development.some(item => item.test(url))) {
    return 'development'
  }
  return false
}

export default getEnv
