/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mock
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2018/11/7-5:50 PM
 Description:
 Param:
 Return:
 *************************************************/
import Mock from 'mockjs'
import _ from 'lodash'
import parseUrl from '../../../../js/parseURL'

const Random = Mock.Random

const loadData = function(data){
  return ({
    status:0,
    msg:'',
    data:data || []
  })
}

Mock.setup({
  timeout: '200-600'
})

/*Mock.mock(/\/time\/get/, () => {
  return loadData({timestamp:Math.floor(_.now() / 1000)})
})*/

/*Mock.mock(/getCoupon/, res=>{
  return loadData(Mock.mock({
    "list|3-7": [
      {
        "nickName|1": [
          '思绪蔓延ヽ泪决堤',
          '如今丶还在期待什么',
          '无畏孤独',
          '冷言冷语冷伤人',
          '深拥情话梦一场',
          '此生不必再相遇',
          '情深已故',
          '爱一瞬间的悲伤',
          '再见如陌',
          '丧戏',
          '归无期',
          '众人皆醉',
          '昭昭无归期',
          '不讨欢心',
          '揉碎了心酸',
          '那些不堪言的疼痛',
          '花开淡墨',
          '旧颜i',
          '不曾走远',
          '时光偷走初心',
          '清酒孤灯',
          '深雨燕紛飛'
        ],
        "headimgurl|1":[
          'http://img4.imgtn.bdimg.com/it/u=1091628847,41930541&fm=26&gp=0.jpg',
          'http://img3.imgtn.bdimg.com/it/u=1731988545,1241190942&fm=26&gp=0.jpg',
          'http://img2.imgtn.bdimg.com/it/u=3244388588,4239675616&fm=26&gp=0.jpg',
          'http://img2.imgtn.bdimg.com/it/u=1162175335,3775023407&fm=26&gp=0.jpg',
          'http://img5.imgtn.bdimg.com/it/u=3319406029,1374742652&fm=26&gp=0.jpg',
          'http://img3.imgtn.bdimg.com/it/u=2347860126,2644010131&fm=26&gp=0.jpg',
          'http://img3.imgtn.bdimg.com/it/u=3918913858,2812086939&fm=26&gp=0.jpg',
          'http://img4.imgtn.bdimg.com/it/u=46668506,1479612944&fm=26&gp=0.jpg',
          'http://img2.imgtn.bdimg.com/it/u=3101572270,4276407518&fm=26&gp=0.jpg',
          'http://img0.imgtn.bdimg.com/it/u=1259452553,613185457&fm=26&gp=0.jpg',
          'http://img1.imgtn.bdimg.com/it/u=2825891060,1914983253&fm=26&gp=0.jpg',
          'http://img2.imgtn.bdimg.com/it/u=1937006600,3291256522&fm=26&gp=0.jpg'
        ],
        "get_time":function(){return Math.floor(new Date(Mock.mock('@datetime')).getTime()/1000)},
        "money|1-10":1,
        "is_best|1":true
      }
    ]
  }))
})*/

Mock.mock(/change-phone/, res=>{
  return loadData()
})

