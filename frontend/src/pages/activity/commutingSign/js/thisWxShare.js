import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
let host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '广佛通勤老司机招募令', // 分享标题
        desc: '跨城租车福利来袭', // 分享描述
        link: 'https://'+host+'/activity/commutingSign/index.html?channel=wx_share', // 分享链接
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
