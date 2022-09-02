/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
import Umeng from '../../../../component/umeng'
new Umeng(1272339506)
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '考验我们友情的时候到了', // 分享标题
        desc: '发现个领现金的好路子，需要你帮我完成它', // 分享描述
        link: 'https://'+host+'/activity/millionGift/plus.html?channel=wxshare2', // 分享链接
        imgUrl: 'https://activity.likechuxing.com/images/activity_spread/logo.png', // 分享图标
        type: 'link', // 分享类型,music、video或link，不填默认为link
        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
        success: function () {
            window._czc.push(["_trackEvent",'plus','share','wx','success']);
        },
        cancel: function () {
            window._czc.push(["_trackEvent",'plus','share','wx','cancel']);
        }
	})
}
