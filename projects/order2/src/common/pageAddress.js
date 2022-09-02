/**
 * Created by garvey on 2017/8/25.
 */
import Env from './env.js'

const HOST = Env.IsProduction ? 'https://api.likechuxing.com' : 'https://apitest.likechuxing.com'
let H5_HOST = Env.isProduction ? 'https://h5.likechuxing.com' : 'https://h5test.likechuxing.com'
//const SELF =  Env.isProduction ? 'https://m.likechuxing.com' : 'https://h5test.likechuxing.com'
const SELF = window.location.origin

const PAGE = {
  selfMain:{title:'立刻出行',href:SELF},
  selfFinish:{title:'订单详情',href:SELF+'/rental/finish'},
  selfLicense:{title:'身份认证',href:SELF+'/user/license'},
  describeRegisterAgreement: {title: '立刻出行服务条款', href: HOST + '/describe/regis-agreement'},
  describeDeposit: {title: '立刻出行押金规则', href: HOST + '/describe/deposit'},
  coupons: {title: '优惠券', href: H5_HOST + '/app/coupons'},
  invite: {title: '邀请好友', href: H5_HOST + '/app/inviteCode'},
  couponUse:{title:'优惠券',href:H5_HOST + '/app/couponUse'},
  rentalDetail:{title:'订单详情',href:H5_HOST + '/app/rentalDetail'},
  damageShow:{title:'查看验车单',href:H5_HOST + '/app/checkDamageShow'}
}

export default PAGE
