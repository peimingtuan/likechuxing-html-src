/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import _czc from './umeng'

export default function () {
	return new WxShare({
		shareMsg: {
			title: '立刻出行11', // 分享标题
			desc: '描述11', // 分享描述
			link: 'http://www.baidu.com', // 分享链接
			imgUrl: 'https://h5.likechuxing.com/images/activity_spread/logo.png', // 分享图标
			type: 'link', // 分享类型,music、video或link，不填默认为link
			dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
			success: function () {
				_czc.push(["_trackEvent",'target_activity','action_share','wx','success']);
			},
			cancel: function () {
				_czc.push(["_trackEvent",'target_activity','action_share','wx','cancel']);
			}
		}
	})
}
