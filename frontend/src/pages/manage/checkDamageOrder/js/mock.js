/**
 * Created by garvey on 2017/9/20.
 */
import Mock from 'mockjs'
import getApiUrl from '../../../../js/getApiUrl'
import getActivityapiUrl from '../../../../js/getActivityapiUrl'

Mock.setup({
	timeout: '200-600'
})

let list = [
	['/time/get', {
		'timestamp': Math.floor(new Date().getTime() / 1000)
	}],
	['/getBtnNum', {
		'rearView|0-10': 1,
		'tyre|0-10': 1,
		'other|0-10': 1,
		'all|0-10': 1
	}],
	['/getRearViewList', {
		'list|10': [
			{
				'id|+1': 3987,
				'plate_no|1': [
					'京'+'@string("upper", 2)'+'@string("number", 4)',
					'粤'+'@string("upper", 2)'+'@string("number", 4)'
				],
				'vin':'@string("number", 6)',
				'time': '@datetime',
				'parts|1-5':[
					{
						'part_id|1-19':1,
						'part_name':'部位名称',
						'count|1-10':1
					}
				]
			}
		]
	}],
	['/getOperationList', {
		'list|10': [
			{
				'id|+1': 3987,
				'phone': 13812341234,
				'name':'@cname',
				'time': '@datetime',
				'operation':'@cword(5,35)'
			}
		]
	}],
	['/getCheckDamageOrder', {
		'list|5': [
			{
				"ddid|+1": 1234,
				"time": '@datetime',
				'parts|1-5':[
					{
						'part_id|1-19':1,
						'part_name':'部位名称'
					}
				],
				"photos|1-5": [
					'https://camo.githubusercontent.com/8596f382156e65c0b67dba7e1c31168eed7d734f/68747470733a2f2f6f70656e636f6c6c6563746976652e636f6d2f7075672f6261636b65722f342f6176617461722e737667'
				]
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
	Mock.mock(getApiUrl(item[0]), {
		'status': 0,
		'msg': 'msg',
		'data': item[1]
	})
	Mock.mock(getActivityapiUrl(item[0]), {
		'status': 0,
		'msg': 'msg',
		'data': item[1]
	})
})