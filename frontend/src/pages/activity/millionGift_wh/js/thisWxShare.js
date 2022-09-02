/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import Umeng from '../../../../component/umeng'
new Umeng(1272851110)
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '特大喜讯，武汉共享汽车立刻出行免费啦！', // 分享标题
        desc: '开车统统不要钱，不要钱！开1公里还补贴1元，支付宝提现实时到账！', // 分享描述
        link: 'https://'+host+'/activity/millionGift/share.html?channel=wxshare2', // 分享链接
        imgUrl: 'https://activity.likechuxing.com/images/activity_spread/logo.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            window._czc.push(["_trackEvent",'activity','share','wx','success']);
        },
        cancel: function () {
            window._czc.push(["_trackEvent",'activity','share','wx','cancel']);
        }
	})
}
