import WxShare from '../../../../../other_modules/like-wxShare'
import env from '../../../../../other_modules/like-env'

let host = env.isProduction ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function () {

  return new WxShare({
    title: '立刻合伙人 返现榜单揭晓', // 分享标题
    desc: '十月份返现榜单出炉！最多的提现五千多元，快来看看有没有你？', // 分享描述
    link: 'https://' + host + '/activity/inviteFriends4_oct', // 分享链接
    imgUrl: 'https://' + host + '/activity/inviteFriends4_oct/share.png', // 分享图标
    type: 'link', // 分享类型,music、video或link，不填默认为link
    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
    success: function () {
      //window._czc.push(["_trackEvent",'activity','share','wx','success']);
    },
    cancel: function () {
      //window._czc.push(["_trackEvent",'activity','share','wx','cancel']);
    }
  })
}
