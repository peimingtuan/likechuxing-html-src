import WxShare from '../../../../../other_modules/like-wxShare'
import env from '../../../../../other_modules/like-env'

let host = env.isProduction ? "activity.likechuxing.com" : "h5test.likechuxing.com"

export default function (uuid) {
  let uuid_str = ''
  if (uuid) uuid_str = '?inviter_uuid=' + uuid
  return new WxShare({
    title: '送你一个50元红包！戳进来就能领取！', // 分享标题
    desc: '还没用过共享汽车？新用户首次租车立减50元，快来试试吧！', // 分享描述
    link: 'https://' + host + '/activity/inviteFriends4' + uuid_str, // 分享链接
    imgUrl: 'https://' + host + '/activity/inviteFriends4/share.png', // 分享图标
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
