/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: car
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/4/27-下午5:49
 Description:
 Param:
 Return:
 *************************************************/
//import Damage from '../pages/car/damage'
const Damage = ()=> import(/* webpackChunkName: "group-damage" */'../pages/car/damage.vue')
import TakePhoto from '../pages/car/takePhoto'

export default [
  {
    name: 'damage',
    path: '/car/damage',
    meta: {
      title: '验车单',
      needAuth: true
    },
    components: {
      mainView: Damage
    }
  },
  {
    name: 'takePhoto',
    path: '/car/takePhoto',
    meta: {
      title: '拍摄车伤图片',
      needAuth: true
    },
    components: {
      mainView: TakePhoto
    }
  }
]
