/**
 * Created by garvey on 2017/6/23.
 */
import getEnv from './env.js'

let HOST = 'https://apitest.likechuxing.com'
let SELF = 'https://h5test.likechuxing.com'

if (getEnv() === 'production') {
  HOST = 'https://api.likechuxing.com'
  SELF = 'https://h5.likechuxing.com'
}

const API = {
  self: SELF,
  host: HOST,
  openIdFile: SELF + '/transition/wxOpenId.php',
  time: {
    get: HOST + '/time/get'
  },
  describe: {
    getCityId: HOST + '/describe/get-cityid'
  },
  deposit: {
    history: HOST + '/deposit/history',
    payBack: HOST + '/deposit/pay-back-deposit',
    query: HOST + '/deposit/query'
  },
  license: {
    wxSubmit: HOST + '/license/wx-submit'
  },
  user: {
    personalCenter: HOST + '/user/personal-center',
    information: HOST + '/user/information'
  },
  login: {
    getCode: HOST + '/login/get-code',
    verifyCode: HOST + '/login/verify-code'
  },
  wxjs: {
    signPackage: HOST + '/wx-js/sign-package'
  },
  pay: {
    index: HOST + '/pay/index'
  },
  wxJs: {
    openId: HOST + '/wx-js/open-id'
  }
}

export default API
