import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import Umeng from '../../../../component/umeng'
new Umeng(1273121333)
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '开共享汽车立刻出行，分百万现金', // 分享标题
        desc: '用坐地铁的钱，"霸占"一辆汽车', // 分享描述
        link: 'https://'+host+'/activity/millionGift2/share.html?channel=wxshare2', // 分享链接
        imgUrl: 'https://'+host+'/images/activity_millionGift2/share.png', // 分享图标
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
