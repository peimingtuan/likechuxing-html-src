/**
 * Created by garvey on 2017/9/20.
 */
require('./css/explain.less')
import toast from '../../../component/toast'
import parseURL from '../../../js/parseURL'
import $ from 'jquery'
import thisWxShare from './js/thisWxShare'
import getApiUrl from '../../../js/getApiUrl'
import myAjax from '../../../component/myAjax'
import text from './js/activity_text'
import {IsWeiXin} from '../../../js/UserAgent'


// import templates
import rules from './template/rules'
import details from './template/details'
import apartFromApple from './template/apartFromApple'
import btn from './template/btn'
import Confirm from '../../../component/confirm'
import wxShareSelector from '../../../component/wxShareSelector'
import _czc from './js/umeng'


init()

function init() {
	loadPage()
	/*
	if (IsWeiXin()) {
		thisWxShare()
	}
	*/
}

function loadPage () {
	$('.container').append(
		details({
			title: '活动规则',
			details:[
				{title: '1.参与资格', des: '注册并认证通过后可参与活动'},
				{title: '2.邀请方式', des: '转发邀请函给好友，好友通过邀请函注册立刻出行并认证成功即可。<span class="gray">（ 已注册用户不在邀请范围 ）</span>'},
				{title: '3.评奖方式', des: '<div class="items">①10月10日10:00，活动正式上线，实时统计邀请数量，排名实时更新；</div><div class="items">②10月18日24:00活动截止，截止后提交认证不计入邀请数量；</div><div class="items">③10月19日12:00以最终认证成功数量进行排名并固定。</div><div class="items">④邀请数量相同按邀请最后一位通过认证好友提交认证时间先后进行排名。</div>'},
				{title: '4.获奖发布', des: '获奖名单将于10月20日通过微信公众号立刻出行、立刻出行广州；立刻出行官方微博同时公布。您也可以登录立刻出行APP活动页面自行查看。'},
				{title: '5.活动声明', des: '在法律法规允许范围内，立刻出行APP拥有本规则最终解释权。'}
			]
		})
	)

	$('.items').parentsUntil('ul').find('p').remove()

/*
	if (!query.hasOwnProperty('user_version') && !IsWeiXin()) {
		// 不在app或者微信中，不显示分享按钮
		$('.btn_con_long').remove()
	} else {
		$('.btn_con_long').on('click', function () {
			if (IsWeiXin()) {
				//显示分享遮罩
			} else {
				if (license_status != 0) {
					new Confirm({
						type: 'alert',
						msg: '需要身份认证通过后，才能参加此活动，赶快去个人中心认证吧。',
						confirmButtonText: '知道了'
					})
					return
				}

				if (Number(query.user_version.split('_')[1]) >= 1400) {
					wxShareSelector({
						pyqCb: function () {
							_czc.push(["_trackEvent",'target_explain','action_share','app','pyq'])
							alert(JSON.stringify({
								like: {
									type: 6,
									destination: 1
								}
							}))
						},
						wxCb: function () {
							_czc.push(["_trackEvent",'target_explain','action_share','app','wx'])
							alert(JSON.stringify({
								like: {
									type: 6,
									destination: 2
								}
							}))
						}
					})
				} else {
					_czc.push(["_trackEvent",'target_explain','action_share','app','version_below_1400'])
					new Confirm({
						type: 'alert',
						msg: '请将APP升级到最新版本参与活动',
						confirmButtonText: '知道了'
					})
				}
			}
		})
	}
*/


}

