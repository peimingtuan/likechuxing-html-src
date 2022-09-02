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

const loadData = function (data) {
  return ({
    status: 0,
    msg: '',
    data: data || []
  })
}

Mock.setup({
  timeout: '200-600'
})

Mock.mock(/\/vehicle-maintain\/order-list/, req => {
  return {
    "status": 0,
    "msg": "请求成功",
    "data": [{
      "distance": null,
      "during_sec": "22天 5小时 50分钟 ",
      "id": "26",
      "city_id": "197",
      "current_branch_id": "10024",
      "current_manage_branch_id": "0",
      "plate_no": "京26",
      "vin": "vin26",
      "status": "34",
      "remain_km": "440",
      "parking_floor": "地面",
      "parking_no": "2",
      "car_factory": null,
      "branch_addr": null,
      "biz_type": null,
      "branch_id": null,
      "bcity": null,
      "area": null,
      "brand_name": "起亚",
      "model_name": "K2",
      "power_type": "2",
      "unmove_time": [124, 23, 7],
      "limit_record": [{"day": "25", "limit": 0}, {"day": "26", "limit": 0}, {"day": "27", "limit": 0}, {
        "day": "28",
        "limit": 0
      }, {"day": "29", "limit": 2}],
      "park_fee": 0,
      "status_name": "巡检",
      "last_desc": "创建预警工单"
    }, {
      "distance": "30",
      "during_sec": "32天 22小时 57分钟 ",
      "id": "101817",
      "city_id": "1",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京A78903",
      "vin": "r12345678911311",
      "status": "21",
      "remain_km": "0",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": "三方",
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "日产",
      "model_name": "轩逸",
      "power_type": "2",
      "park_fee": 0,
      "status_name": "缺油下线",
      "last_desc": ""
    }, {
      "distance": "30",
      "during_sec": "32天 2小时 52分钟 ",
      "id": "101831",
      "city_id": "1",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京LY1114",
      "vin": "2.11116E+18",
      "status": "21",
      "remain_km": "0",
      "parking_floor": "地面",
      "parking_no": "12",
      "car_factory": "自研",
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "北汽",
      "model_name": "赛欧",
      "power_type": "1",
      "park_fee": 0,
      "status_name": "缺电下线",
      "last_desc": "无"
    }, {
      "distance": "30",
      "during_sec": "22天 6小时 23分钟 ",
      "id": "6",
      "city_id": "1",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京A12346",
      "vin": "vin6",
      "status": "34",
      "remain_km": "200",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": null,
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "北汽",
      "model_name": "赛欧",
      "power_type": "1",
      "park_fee": 0,
      "status_name": "巡检",
      "last_desc": "创建预警工单"
    }, {
      "distance": "30",
      "during_sec": "20天 5小时 50分钟 ",
      "id": "101770",
      "city_id": "1",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京CV5586",
      "vin": "r12345678911383",
      "status": "34",
      "remain_km": "200",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": "自研",
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "北汽",
      "model_name": "赛欧",
      "power_type": "1",
      "park_fee": 0,
      "status_name": "巡检",
      "last_desc": "测试"
    }, {
      "distance": "30",
      "during_sec": "27天 22小时 25分钟",
      "id": "848",
      "city_id": "197",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京HTY848",
      "vin": "vin848",
      "status": "1",
      "remain_km": "220",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": null,
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "起亚",
      "model_name": "K2",
      "power_type": "2",
      "limit_record": [{"day": "25", "limit": 0}, {"day": "26", "limit": 0}, {"day": "27", "limit": 0}, {
        "day": "28",
        "limit": 0
      }, {"day": "29", "limit": 2}],
      "park_fee": 0,
      "status_name": "空闲",
      "last_desc": ""
    }, {
      "distance": "30",
      "during_sec": "20天 36分钟 ",
      "id": "2018",
      "city_id": "1",
      "current_branch_id": "159",
      "current_manage_branch_id": "0",
      "plate_no": "京J52018",
      "vin": "vin2018",
      "status": "31",
      "remain_km": "440",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": null,
      "branch_addr": "西二旗西路地下网点",
      "biz_type": "0",
      "branch_id": "159",
      "bcity": "1",
      "brand_name": "起亚",
      "model_name": "K2",
      "power_type": "2",
      "park_fee": 0,
      "status_name": "维修",
      "last_desc": "事故工单自费维修"
    }, {
      "distance": "39",
      "during_sec": "41天 23小时 55分钟 ",
      "id": "101809",
      "city_id": "1",
      "current_branch_id": "3008",
      "current_manage_branch_id": "0",
      "plate_no": "",
      "vin": "r12345678911310",
      "status": "21",
      "remain_km": "0",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": null,
      "branch_addr": "国际软件大厦三区（++限行区内玥峯）",
      "biz_type": "1",
      "branch_id": "3008",
      "bcity": "1",
      "brand_name": "日产",
      "model_name": "轩逸",
      "power_type": "2",
      "park_fee": 99,
      "status_name": "缺油下线",
      "last_desc": "测试，维修备注"
    }, {
      "distance": "39",
      "during_sec": "24天 1小时 28分钟 ",
      "id": "101814",
      "city_id": "1",
      "current_branch_id": "3008",
      "current_manage_branch_id": "0",
      "plate_no": "京A12565",
      "vin": "r12345678911317",
      "status": "32",
      "remain_km": "0",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": null,
      "branch_addr": "国际软件大厦三区（++限行区内玥峯）",
      "biz_type": "1",
      "branch_id": "3008",
      "bcity": "1",
      "brand_name": "日产",
      "model_name": "轩逸",
      "power_type": "2",
      "park_fee": 4224,
      "status_name": "故障",
      "last_desc": "呃呃呃呃"
    }, {
      "distance": "39",
      "during_sec": "24天 23小时 53分钟 ",
      "id": "101819",
      "city_id": "1",
      "current_branch_id": "3008",
      "current_manage_branch_id": "0",
      "plate_no": "川A8P81J",
      "vin": "",
      "status": "21",
      "remain_km": "0",
      "parking_floor": "地面",
      "parking_no": "",
      "car_factory": "自研",
      "branch_addr": "国际软件大厦三区（++限行区内玥峯）",
      "biz_type": "1",
      "branch_id": "3008",
      "bcity": "1",
      "brand_name": "2016",
      "model_name": "捷达",
      "power_type": "2",
      "park_fee": 2784,
      "status_name": "缺油下线",
      "last_desc": ""
    }]
  }
})

Mock.mock(/\/get\/history/, () => {
  return loadData([
    {
      id: 0,
      plate_no: "京12345",
      vin: '12qwdfvdlkfjewfjd',
      model_name: '起亚',
      maintain_status: 0,
      maintain_status_desc: '待保养'
    },
    {
      id: 1,
      plate_no: "京12345",
      vin: '12qwdfvdlkfjewfjd',
      model_name: '起亚',
      maintain_status: 1,
      maintain_status_desc: '保养中'
    },
    {
      id: 2,
      plate_no: "京12345",
      vin: '12qwdfvdlkfjewfjd',
      model_name: '起亚',
      maintain_status: 2,
      maintain_status_desc: '已完成'
    }
  ])
})

Mock.mock(/get\/carMaintain/, () => {
  return loadData({
    "distance": null,
    "during_sec": "22天 5小时 50分钟 ",
    "id": "26",
    "city_id": "197",
    "current_branch_id": "10024",
    "current_manage_branch_id": "0",
    "plate_no": "京26",
    "vin": "vin26",
    "status": "34",
    "remain_km": "440",
    "parking_floor": "地面",
    "parking_no": "2",
    "car_factory": null,
    "branch_addr": null,
    "biz_type": null,
    "branch_id": null,
    "bcity": null,
    "area": null,
    "brand_name": "起亚",
    "model_name": "K2",
    "power_type": "2",
    "unmove_time": [124, 23, 7],
    "limit_record": [{"day": "25", "limit": 0}, {"day": "26", "limit": 0}, {"day": "27", "limit": 0}, {
      "day": "28",
      "limit": 0
    }, {"day": "29", "limit": 2}],
    "park_fee": 0,
    "status_name": "巡检",
    "last_desc": "创建预警工单"
  })
})

Mock.mock(/get\/carRemind/, () => {
  return loadData({
    "distance": null,
    "during_sec": "22天 5小时 50分钟 ",
    "id": "26",
    "city_id": "197",
    "current_branch_id": "10024",
    "current_manage_branch_id": "0",
    "plate_no": "京26",
    "vin": "vin26",
    "status": "34",
    "remain_km": "440",
    "parking_floor": "地面",
    "parking_no": "2",
    "car_factory": null,
    "branch_addr": null,
    "biz_type": null,
    "branch_id": null,
    "bcity": null,
    "area": null,
    "brand_name": "起亚",
    "model_name": "K2",
    "power_type": "2",
    "unmove_time": [124, 23, 7],
    "limit_record": [{"day": "25", "limit": 0}, {"day": "26", "limit": 0}, {"day": "27", "limit": 0}, {
      "day": "28",
      "limit": 0
    }, {"day": "29", "limit": 2}],
    "park_fee": 0,
    "status_name": "巡检",
    "last_desc": "创建预警工单"
  })
})

// 维修站
Mock.mock(/maintain-branch/,()=>{
  return loadData([
    {'id':1, 'place_name':'西二旗维修站'},
    {'id':2, 'place_name':'西二旗维修站2'},
    {'id':3, 'place_name':'西二旗维修站3'},
    {'id':4, 'place_name':'上地维修站'},
    {'id':5, 'place_name':'上地旗维修站2'},
    {'id':6, 'place_name':'天津旗维修站'}
  ])
})

Mock.mock(/maintain-type/,()=>{
  return loadData([
    {
      "id": 11,
      "name": "常规保养",
      "child": [
        {
          "id": 1122,
          "name": "轮胎"
        },
        {
          "id": 1123,
          "name": "车窗"
        }
      ]
    },
    {
      "id": 12,
      "name": "深度保养",
      "child": [
        {
          "id": 1222,
          "name": "机油"
        },
        {
          "id": 1224,
          "name": "机滤"
        }
      ]
    },
    {
      "id": 13,
      "name": "超级长的名字把阿布就看保养",
      "child": [
        {
          "id": 1222,
          "name": "机油2"
        },
        {
          "id": 1224,
          "name": "机滤2"
        }
      ]
    },
    {
      "id": 14,
      "name": "超级保养",
      "child": [
        {
          "id": 1222,
          "name": "机油3"
        },
        {
          "id": 1224,
          "name": "机滤4"
        }
      ]
    }
  ])
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



