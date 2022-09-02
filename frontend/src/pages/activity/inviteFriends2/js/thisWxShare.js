import WxShare from '../../../../js/wx/WxShare'
import env from '../../../../js/env'
const host = env()==='production' ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function (uuid) {
	return new WxShare({
        title: '测测我到底有多少好友', // 分享标题
        desc: '增加1个好友可以多领50元，敢不敢先来10个！', // 分享描述
        link: 'https://'+host+'/activity/inviteFriends2/share.html?channel=wxshare2&inviter_uuid='+uuid, // 分享链接
        imgUrl: 'https://'+host+'/images/activity_inviteFriends2/share.png', // 分享图标
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
