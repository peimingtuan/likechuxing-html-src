import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
let host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '分享1张50元出行券给你', // 分享标题
        desc: '用券开车不花钱，免费体验「立刻出行」', // 分享描述
        link: 'https://'+host+'/activity/registerCoupon2/index.html?channel=0_8982', // 分享链接
        imgUrl: 'https://'+host+'/images/activity_spread/logo.png', // 分享图标
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
