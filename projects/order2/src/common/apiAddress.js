/**
 * Created by garvey on 2017/6/23.
 */
import Env from './env.js'

let HOST = 'https://apitest.likechuxing.com'
let H5 = 'https://h5test.likechuxing.com'

if (Env.IsProduction) {
  HOST = 'https://api.likechuxing.com'
  H5 = 'https://h5.likechuxing.com'
}

const API = {
  self: H5,
  host: HOST,
  openIdFile: H5 + '/transition/wxOpenId.php',
  time: {
    get: HOST + '/time/get'
  },
  branch:{
    list: HOST + '/branch/list',
    modifyEndBranch:HOST+'/branch/modify-end-branch',
    getNearbyBranch:HOST+'/branch/get-nearby-branch'
  },
  car:{
    list:HOST + '/car/list'
  },
  city:{
    icon:HOST + '/city/icon'
  },
  rental:{
    create:HOST + '/rental/create',
    currentInfo:HOST + '/rental/current-info',
    remainCancelTime:HOST + '/rental/remain-cancle-time',
    cancel:HOST+'/rental/cancel',
    findCar:HOST+'/rental/find-car',
    lockDoor:HOST+'/rental/close-door',
    openDoor:HOST+'/rental/open-door',
    finishCheckBranch:HOST+'/rental/finish-check-branch',
    finishOrder:HOST+'/rental/finish-order',
    confirmOrder:HOST+'/rental/confirm-order',
    currentExpense:HOST+'/rental/current-expense',
    couponList:HOST+'/rental/coupon-list'
  },
  rentalHistory:{
    detail:HOST+'/rental-history/detail',
    comment:HOST+'/rental-history/comment',
    feeDetail:HOST+'/rental-history/fee-detail'
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
    wxSubmit: HOST + '/license/wx-submit',
    submit:HOST + '/license/submit'
  },
  user: {
    personalCenter: HOST + '/user/personal-center',
    information: HOST + '/user/information',
    rentalDetail:HOST + '/user/rental-detail'
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
  upload:{
    carBeforePhoto:HOST+'/upload/car-before-photo',
    carBeforeParts:HOST+'/upload/car-before-parts'
  },
  wxJs: {
    signPackage: HOST + '/wx-js/sign-package',
    openId: HOST + '/wx-js/open-id'
  }
}

export default API
