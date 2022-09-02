import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
let host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {
	return new WxShare({
        title: '共享汽车免费开', // 分享标题
        desc: '立刻送券  免费用车', // 分享描述
        link: 'https://'+host+'/activity/parkingLot/index.html?channel=0_8967', // 分享链接
        imgUrl: 'https://'+host+'/images/activity_parkingLot/share.png', // 分享图标
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
