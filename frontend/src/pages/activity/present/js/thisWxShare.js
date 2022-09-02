import WxShare from '../../../../../other_modules/wx-sign'
import ENV from '../../../../../other_modules/like-env'

let host = ENV.isProduction ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function (uuid) {
  return new WxShare({
    title: '点击免费体验共享汽车', // 分享标题
    desc: '我注册了"立刻出行"，可以免费体验用车，你也快来。', // 分享描述
    link: 'https://' + host + '/activity/present/share.html?channel=summer_wxshare', // 分享链接
    imgUrl: 'https://' + host + '/images/activity_inviteFriends3/share.png', // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      window._czc.push(["_trackEvent", 'activity', 'share', 'wx', 'success']);
    },
    cancel: function () {
      window._czc.push(["_trackEvent", 'activity', 'share', 'wx', 'cancel']);
    }
  })
}
