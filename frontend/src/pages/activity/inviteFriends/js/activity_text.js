/**
 * Created by garvey on 2017/9/23.
 */
export default {
	prizeList:[
		{
			level: '特等奖',
			prize: 'iPhone X',
			limit: '2',
			limitDesc: '1-2'
		},
		{
			level: '一等奖',
			prize: 'iPhone 8',
			limit: '5',
			limitDesc: '3-7'
		},
		{
			level: '二等奖',
			prize: '魅蓝 6',
			limit: '10',
			limitDesc: '8-17'
		},
		{
			level: '三等奖',
			prize: '小米手环 2',
			limit: '50',
			limitDesc: '18-67'
		},
		{
			level: '分享奖',
			prize: '30元用车券',
			limit: '100',
			limitDesc: '68-166'
		}
	],
	explain: {
		title: '活动概述',
		details: [
			{title: '1.活动时间', des: '2017年10月10日 - 10月18日'},
			{title: '2.参与方式', des: '邀请好友注册并认证立刻出行，邀请好友数量越多，距离X越近！'},
			{title: '3.活动奖品', des: ' iPhone X、iPhone 8、魅蓝 6、小米手环……'},
		]
	},
	rules: {
		title: '活动规则',
		details: [
			{title: '1.参与资格', des: '注册并认证通过后可参加活动'},
			{title: '2.邀请方式', des: '转发邀请函给好友，好友通过邀请函注册<span class="red">认证</span>即可。已认证用户不在邀请范围'},
			{title: '3.评奖方式', des: '实时统计邀请数量，排名实时更新，对应奖品相应变化；活动截止，排名固定'},
			{title: '4.活动结果', des: '数量相同按邀请最后一位好友认证通过时间先后进行排名'},
		]
	}
}