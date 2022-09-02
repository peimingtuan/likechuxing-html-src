import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
let host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function (uuid) {
	return new WxShare({
        title: '参与竞猜，共享汽车免费开', // 分享标题
        desc: '「立刻出行」决定送一波免费开车的资格，猜中比赛结果就有机会获得！', // 分享描述
        link: 'https://'+host+'/activity/worldCup/index.html?channel=wx_share&inviter_uuid='+uuid, // 分享链接
        imgUrl: 'https://'+host+'/images/activity_worldCup/share.png', // 分享图标
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
