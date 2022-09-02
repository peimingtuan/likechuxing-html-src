import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
let host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '【提醒】您有一张50元优惠券待领取', // 分享标题
        desc: '点击领取50元出行券，免费来开共享汽车吧！', // 分享描述
        link: 'https://'+host+'/activity/edaijia/index.html?channel=0_8970', // 分享链接
        imgUrl: 'https://'+host+'/images/activity_edaijia/share.png', // 分享图标
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
