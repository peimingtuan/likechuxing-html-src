/*************************************************
 Copyright (C), since 2017, Likechuxing Tech. Co., Ltd.
 File name: mock
 Author: garvey sunjiawei@likechuxing.com
 Version: 1.0.0
 Date: 2017/11/29-下午5:49
 Description:
 Param:
 Return:
 *************************************************/
import Mock from 'mockjs'

Mock.setup({
    timeout: '200-600'
})

let list = [
    ['/time/get', {
        'timestamp': Math.floor(new Date().getTime() / 1000)
    }],
    ['/getIndexData', {
        'dataa|10': 'd'
    }],
    ['/aaa/aaa', {
        'list|8': [
            {
                'no|+1': 1,
                'phone_no|+1': 13800000000,
                'prize|1': [
                    'iPhone X!',
                    'iPhone 8!',
                    '魅蓝 5 手机!',
                    '小米手环 2!',
                    '优惠券!'
                ]
            }
        ]
    }],
    ['/getWinnerListMore', {
        'list|30': [
            {
                'index|+1': 9,
                'phone': '138****4321',
                'prize|1': [
                    '魅蓝手机',
                    '小米手环',
                    '优惠券'
                ]
            }
        ]
    }],
    ['/activity-like-x/invite-list', {
        'list|10': [
            {
                "phone_no": "188****1928",
                "status": "2",
                "reminded": "0",
                "update_time": "1502938392"
            }
        ]
    }],
    ['/activity-like-x/rank', {
        "no": 27,
        "current_prize|1": [
            'iPhone X',
            'iPhone 8',
            '魅蓝5手机',
            '小米手环2',
            '30元用车券'
        ],
        "next_prize": "30元用车券",
        "next_prize_dis": 112
    }]
]

list.forEach( item => {
    Mock.mock(item[0], {
        'status': 0,
        'msg': 'msg',
        'data': item[1]
    })
})