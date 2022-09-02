/**
 * Created by garvey on 2017/9/26.
 */
import WxShare from '../../../../js/wx/WxShare'
import Umeng from '../../../../component/umeng'
new Umeng(1272197132)

export default function () {
	return new WxShare({
        title: '128元春节长租红包，来了就能领', // 分享标题
        desc: '立刻出行春节期间推出长租业务，点击领取128元专享券', // 分享描述
        link: 'https://activity.likechuxing.com/activity/preLongRental/download.html', // 分享链接
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
