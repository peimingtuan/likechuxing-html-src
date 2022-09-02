import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import Umeng from '../../../../component/umeng'
new Umeng(1273374364)
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '最好用的共享汽车"立刻出行"来南京了！', // 分享标题
        desc: '每天3小时免费开，开1公里领1元，立刻瓜分百万现金！', // 分享描述
        link: 'https://'+host+'/activity/millionGift_nj/share.html?channel=74_millionGiftWxShare', // 分享链接
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
