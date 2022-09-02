/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: pay
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/25-上午11:41
 Description:
 Param:
 Return:
 *************************************************/
import Confirm from '../pages/pay/confirm'
import Pay from '../pages/pay/pay'
import CouponUse from '../pages/pay/couponUse'

export default [
  {
    name: 'confirm',
    path: '/pay/confirm',
    meta: {
      title: '确认订单',
      needAuth: true
    },
    components: {
      mainView: Confirm
    }
  },
  {
    name: 'pay',
    path: '/pay/pay',
    meta: {
      title: '支付订单',
      needAuth: true
    },
    components: {
      mainView: Pay
    }
  },
  {
    name: 'couponUse',
    path: '/pay/coupon',
    meta: {
      title: '选择优惠券',
      needAuth: true
    },
    components: {
      mainView: CouponUse
    }
  }
]
