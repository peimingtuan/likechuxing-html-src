/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import Umeng from '../../../../component/umeng'
new Umeng(1272822755)
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '感恩广州 | 百万现金大回馈', // 分享标题
        desc: '广州一百万人在用立刻出行', // 分享描述
        link: 'https://'+host+'/activity/millionGift_gz/share.html?channel=wxshare2', // 分享链接
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
