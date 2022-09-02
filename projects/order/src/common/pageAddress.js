/**
 * Created by garvey on 2017/8/25.
 */
import getEnv from './env.js'

let HOST = 'https://apitest.likechuxing.com'

if (getEnv() === 'production') {
  HOST = 'https://api.likechuxing.com'
}

const PAGE = {
  describeRegisAgreement: {title: '立刻出行服务条款', src: HOST + '/describe/regis-agreement'},
  describeDeposit: {title: '立刻出行押金规则', src: HOST + '/describe/deposit'}
}

export default PAGE
